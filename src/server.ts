import express, { json } from "express";
import path from "path";
import http from "http";
import { Server, Socket } from "socket.io";
import {
  formatAxiosResponseMessages,
  formatMessage,
} from "./utils/formatMessage";
import {
  getCurrentUser,
  getRoomUsers,
  User,
  userJoin,
  userLeave,
} from "./utils/users";
import axios, { AxiosResponse } from "axios";
import { MessageTypes } from "./database/model/message.model";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(json());
app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket: Socket) => {
  const chatBot = "ChatBot";

  socket.on("joinRoom", async (userData: User) => {
    const user = userJoin({
      id: socket.id,
      username: userData.username,
      room: userData.room,
    });

    socket.join(user.room);

    // implement room messages emit event
    try {
      const messages = await axios.get<MessageTypes[]>(
        "localhost:4000/api/messages"
      );

      if (!!messages.data && messages.status === 200) {
        socket.emit("message", formatAxiosResponseMessages(messages));
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
    }

    const msg = formatMessage(user!.username, message);

    const emitMessage = io.to(user!.room).emit("message", msg);

    // save to database
    if (!!emitMessage) {
      try {
        const data = {
          username: msg.username,
          text: msg.text,
          room: user!.room,
          createdAt: msg.createdAt,
        };

        await axios.post<any, any, MessageTypes>(
          "localhost:4000/api/messages",
          data
        );
      } catch (err) {
        console.log(err);
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
