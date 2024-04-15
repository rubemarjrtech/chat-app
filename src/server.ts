import express, { json } from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { formatMessage } from "./utils/formatMessage";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Quand houver conexao de um client
io.on("connection", (socket) => {
  const chatBot = "ChatBot";

  socket.emit("message", formatMessage(chatBot, "Welcome to chatCord"));

  socket.broadcast.emit(
    "message",
    formatMessage(chatBot, "An user has joined the chat!")
  );

  socket.on("disconnect", () => {
    io.emit("message", formatMessage(chatBot, "An user has left the chat."));
  });

  // Listen for chatMessage
  socket.on("chatMessage", (message) => {
    io.emit("message", formatMessage("USER", message));
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
