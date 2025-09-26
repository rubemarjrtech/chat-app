import { Socket } from "socket.io";
import { getRoomUsers, User } from "../utils/users";
import axios from "axios";
import socketIOServerManager from "../socket-io-server";
import {
  formatAxiosResponse,
  formatMessage,
} from "../../src/utils/formatMessage";
import { RoomMessage } from "../../src/types/room-message";

export default async function joinRoom(socket: Socket, userData: User) {
  const chatBot = "ChatBot";
  const io = socketIOServerManager.getInstance();
  const [activeSocket, user] = socketIOServerManager.registerActiveSocket([
    socket,
    userData,
  ]);

  socket.join(user.room);

  try {
    const response = await axios.get<RoomMessage[]>(
      `http://localhost:4000/api/chatcord/messages/`,
      {
        params: {
          room: user.room,
        },
      }
    );

    if (response.data && response.status === 200) {
      io.to(activeSocket.id).emit(
        "roomMessages",
        formatAxiosResponse(response.data)
      );
    }
  } catch (err) {
    console.log(err);
    socket.emit(
      "message",
      formatMessage(
        chatBot,
        "Something went wrong trying to retrieve room messages"
      )
    );
  }

  socket.emit("message", formatMessage(chatBot, "Welcome to chatCord"));

  socket.broadcast
    .to(user.room)
    .emit(
      "message",
      formatMessage(chatBot, `${user.username} has joined the chat!`)
    );

  io.to(user.room).emit("roomUsers", {
    room: user.room,
    users: getRoomUsers(user.room, socketIOServerManager),
  });
}
