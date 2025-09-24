import { Socket } from "socket.io";
import { formatMessage } from "../../src/utils/formatMessage";
import socketIOServerManager from "../socket-io-server";
import axios, { AxiosResponse } from "axios";
import { RoomMessageTypes } from "../../src/types/room-message-types";

export default async function chatMessage(
  socket: Socket,
  message: string,
  callback: Function
) {
  const activeUserSocket = socketIOServerManager.getActiveSocket(socket);

  if (!activeUserSocket) {
    callback({
      success: false,
      error: "Session expired.Try reconnecting.",
      code: "SESSION_EXPIRED",
    });
    return;
  }

  const [activeSocket, user] = activeUserSocket;

  if (!activeSocket.connected) {
    callback({
      success: false,
      error: "Session expired.Try reconnecting.",
      code: "SESSION_EXPIRED",
    });
  } else {
    const msg = formatMessage(user.username, message);

    try {
      const response = await axios.post<
        unknown,
        AxiosResponse,
        RoomMessageTypes
      >(
        "http://localhost:4000/api/chatcord/messages",
        {
          username: msg.username,
          text: msg.text,
          room: user.room,
          createdAt: msg.createdAt,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status !== 201) {
        callback({
          success: false,
          message: "Failed saving to database",
        });
        return;
      }

      const io = socketIOServerManager.getInstance();
      io.to(user.room).emit("message", msg);

      callback({
        success: true,
        message: "Mensagem enviada com sucesso",
      });
    } catch (err) {
      console.log(err);
      callback({
        success: false,
        error: "Error sending mensage",
        code: "SERVER_ERROR",
      });
    }
  }
}
