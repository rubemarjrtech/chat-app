import { Server, Socket } from "socket.io";
import {
  formatAxiosResponseMessages,
  formatMessage,
} from "../src/utils/formatMessage";
import {
  getCurrentUser,
  getRoomUsers,
  User,
  userJoin,
  userLeave,
} from "../src/utils/users";
import axios from "axios";
import { MessageTypes } from "../src/database/model/message.model";

export function configureSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    const chatBot = "ChatBot";

    socket.on("joinRoom", async (userData: User) => {
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
    });

    socket.on("disconnect", () => {
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
        users: getRoomUsers(user.room),
      });
    });

    // Listen for chatMessage
    socket.on("chatMessage", async (message: string) => {
      const user = getCurrentUser(socket.id);

      if (!user) {
        socket.emit(
          "message",
          formatMessage(
            chatBot,
            "Your session seems to have expired. Please reconnect and try again."
          )
        );
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
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    });
  });
}
