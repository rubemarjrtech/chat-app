import * as http from "http";
import { App } from "./app";
import socketServer from "../sockets/socket-server";
import events from "../sockets/events";

(async () => {
  try {
    const app = new App();
    const server = http.createServer(app.app);
    socketServer.setInstance(server).registerAllEvents(events);
    await app.init();

    const PORT = 4000;
    server.listen(PORT, () =>
      console.log(
        `Server running on port ${PORT}`,
        "\nConnected to database successfully!"
      )
    );
  } catch (err) {
    console.log(err);
    console.log("Failed connecting to db");
  }
})();
