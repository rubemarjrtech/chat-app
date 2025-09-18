import { Socket } from "socket.io";
import { getRoomUsers, User, userJoin } from "../../src/utils/users";
import axios from "axios";
import { MessageTypes } from "../../src/database/model/message.model";
import socketServerManager from "../socket-server";
import {
  formatAxiosResponseMessages,
  formatMessage,
} from "../../src/utils/formatMessage";

export default async function joinRoom(socket: Socket, userData: User) {
  const chatBot = "ChatBot";
  const io = socketServerManager.getInstance();
  const user = userJoin({
    id: socket.id,
    username: userData.username,
    room: userData.room,
  });

  socket.join(user.room);

  try {
    const messages = await axios.get<MessageTypes[]>(
      `http://localhost:4000/api/chatcord/messages/`,
      {
        params: {
          room: user.room,
        },
      }
    );

    if (!!messages.data && messages.status === 200) {
      io.to(user.id).emit(
        "roomMessages",
        formatAxiosResponseMessages(messages.data)
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

  // Send users and room info
  io.to(user.room).emit("roomUsers", {
    room: user.room,
    users: getRoomUsers(user.room),
  });
}
