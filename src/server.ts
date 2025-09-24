import * as http from "http";
import socketIOServerManager from "../sockets/socket-io-server";
import events from "../sockets/events";
import app from "./app";

(async () => {
  try {
    const server = http.createServer(app.getFramework());
    socketIOServerManager.setInstance(server).registerAllEvents(events);
    await app.configure();

    const PORT = 4000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.log(err);
    console.log("Failed connecting to db");
  }
})();
