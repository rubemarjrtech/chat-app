import { Server, Socket } from "socket.io";
import * as http from "http";
import { EventTypes } from "./types/event-types";
import { ISocketIOServer } from "./interfaces/ISocketIOServer";

export class SocketServerManager implements ISocketIOServer<Server> {
  private socketServer: Server;
  private activeSockets = new Map<string, Socket>();

  setInstance(config?: http.Server | number): SocketServerManager {
    if (!this.socketServer) {
      if (config) {
        this.socketServer = new Server(config);
      } else {
        this.socketServer = new Server();
      }
    }

    return this;
  }

  getInstance(): Server {
    if (!this.socketServer) {
      this.setInstance();
    }

    return this.socketServer;
  }

  registerActiveSocket(socket: Socket): void {
    this.activeSockets.set(socket.id, socket);
  }

  removeFromActiveSockets(socket: Socket): void {
    this.activeSockets.delete(socket.id);
  }

  isSocketActive(socket: Socket): Socket | void {
    return this.activeSockets.get(socket.id);
  }

  registerAllEvents(events: EventTypes[]) {
    const io = this.getInstance();
    events.forEach((event) => {
      io.on("connection", (socket) => {
        this.registerActiveSocket(socket);
        socket.on(event.name, (...args) => event.handler(socket, ...args));
      });
    });
  }
}

export default new SocketServerManager();
