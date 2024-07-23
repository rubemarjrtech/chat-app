import * as http from "http";
import { App } from "./app";
import { Server } from "socket.io";
import { configureSockets } from "../sockets";

(async () => {
  try {
    const app = new App();
    const server = http.createServer(app.app);

    const io = new Server(server);
    configureSockets(io);

    await app.init();

    const PORT = 4000;
    console.log(`Attempting to run server on port ${PORT}`);
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log("Connected to database successfully!");
  } catch (err) {
    console.log(err);
    console.log("Failed connecting to db");
  }
})();
