import { Socket } from "socket.io";
import { getRoomUsers, userLeave } from "../../src/utils/users";
import { formatMessage } from "../../src/utils/formatMessage";
import socketIOServerManager from "../socket-io-server";

export default async function disconnect(socket: Socket) {
  const chatBot = "ChatBot";
  const io = socketIOServerManager.getInstance();
  const user = userLeave(socket.id);

  if (!user) {
    return;
  }

  io.to(user.room).emit(
    "message",
    formatMessage(chatBot, `User ${user.username} has left the chat.`)
  );

  io.to(user.room).emit("roomUsers", {
    room: user.room,
    users: getRoomUsers(user.room, socketIOServerManager),
  });
}
