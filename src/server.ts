import express, { json } from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { formatMessage } from "./utils/formatMessage";
import {
  getCurrentUser,
  getRoomUsers,
  userJoin,
  userLeave,
} from "./utils/users";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(json());
app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket) => {
  const chatBot = "ChatBot";

  socket.on("joinRoom", (userData: any) => {
    const user = userJoin(socket.id, userData.username, userData.room);

    socket.join(user.room);

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

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(chatBot, `User ${user.username} has left the chat.`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  // Listen for chatMessage
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, message));
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
