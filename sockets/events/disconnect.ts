import { DisconnectReason, Socket } from "socket.io";
import { getRoomUsers } from "../utils/users";
import { formatMessage } from "../../src/utils/formatMessage";
import socketIOServerManager from "../socket-io-server";

export default async function disconnect(socket: Socket, _: DisconnectReason) {
  const chatBot = "ChatBot";
  const user = socketIOServerManager.removeActiveSocket(socket);

  if (!user) {
    return;
  }

  const io = socketIOServerManager.getInstance();
  io.to(user.room).emit(
    "message",
    formatMessage(chatBot, `User ${user.username} has left the chat.`)
  );

  io.to(user.room).emit("roomUsers", {
    room: user.room,
    users: getRoomUsers(user.room, socketIOServerManager),
  });
}
