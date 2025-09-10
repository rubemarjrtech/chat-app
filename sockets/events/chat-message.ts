import { Socket } from "socket.io";
import { MessageTypes } from "../../src/database/model/message.model";
import { formatMessage } from "../../src/utils/formatMessage";
import { getCurrentUser } from "../../src/utils/users";
import socketServer from "../socket-server";
import axios from "axios";

export default async function chatMessage(socket: Socket, message: string) {
  const chatBot = "ChatBot";
  const io = socketServer.getInstance();
  const user = getCurrentUser(socket.id);
  const activeSocket = socketServer.isSocketActive(socket);

  if (!user || !activeSocket) {
    if (activeSocket && activeSocket.connected) {
      socket.emit(
        "message",
        formatMessage(
          chatBot,
          "Your session seems to have expired. Please reconnect and try again."
        )
      );
    }
    return;
  }

  const msg = formatMessage(user.username, message);

  io.to(user.room).emit("message", msg);

  // save to database
  try {
    await axios.post<any, any, MessageTypes>(
      "http://localhost:4000/api/chatcord/messages",
      {
        username: msg.username,
        text: msg.text,
        room: user.room,
        createdAt: msg.createdAt,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.log(err);
  }
}
