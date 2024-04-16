import express, { json } from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { formatMessage } from "./utils/formatMessage";
import { getCurrentUser, userJoin } from "./utils/users";

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
  });

  socket.on("disconnect", () => {
    io.emit("message", formatMessage(chatBot, "An user has left the chat."));
  });

  // Listen for chatMessage
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, message));
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
