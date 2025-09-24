import { Socket } from "socket.io";
import { getRoomUsers, User } from "../../src/utils/users";
import axios from "axios";
import { RoomSchemaTypes } from "../../src/database/model/message.model";
import socketIOServerManager from "../socket-io-server";
import {
  formatAxiosResponseMessages,
  formatMessage,
} from "../../src/utils/formatMessage";

export default async function joinRoom(socket: Socket, userData: User) {
  const chatBot = "ChatBot";
  const io = socketIOServerManager.getInstance();
  const [activeSocket, user] = socketIOServerManager.registerActiveSocket([
    socket,
    userData,
  ]);

  socket.join(user.room);

  try {
    const response = await axios.get<RoomSchemaTypes>(
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
        formatAxiosResponseMessages(response.data)
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
