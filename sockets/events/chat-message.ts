import { Socket } from "socket.io";
import { formatMessage } from "../../src/utils/formatMessage";
import socketIOServerManager from "../socket-io-server";
import axios, { AxiosResponse } from "axios";
import { RoomMessage } from "../../src/types/room-message";
import crypto from "crypto";
import { setMessage } from "../../src/cache/gears-file";

export default async function chatMessage(
  socket: Socket,
  msg: string,
  callback: Function
) {
  const activeUserSocket = socketIOServerManager.getActiveSocket(socket);

  if (!activeUserSocket) {
    callback({
      success: false,
      error: "Session expired. Try reconnecting.",
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
    const message = formatMessage(user.username, msg);
    const messageId = crypto.randomUUID();

    try {
      await setMessage({
        room: user.room,
        username: message.username,
        text: message.text,
        createdAt: message.createdAt,
        messageId,
      });

      const io = socketIOServerManager.getInstance();
      io.to(user.room).emit("message", message);

      callback({
        success: true,
        message: "Message sent successfully!",
      });
    } catch (err) {
      console.log("error on redis", err);

      // If redis failed, the fallback is saving directly to DB
      try {
        const response = await axios.post<unknown, AxiosResponse, RoomMessage>(
          "http://localhost:4000/api/chatcord/messages",
          {
            username: message.username,
            text: message.text,
            room: user.room,
            createdAt: message.createdAt,
            messageId,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status !== 201) {
          callback({
            success: false,
            message: "Failed sending message",
          });
          return;
        }

        const io = socketIOServerManager.getInstance();
        io.to(user.room).emit("message", message);

        callback({
          success: true,
          message: "Message sent successfully!",
        });
      } catch (err) {
        console.log("error with axios", err);
        callback({
          success: false,
          message: "Failed sending message",
        });
      }
    }
  }
}
