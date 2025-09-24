import { Server, Socket } from "socket.io";
import * as http from "http";
import { EventTypes } from "./types/event-types";
import { ISocketIOServer } from "./interfaces/ISocketIOServer";
import { ActiveUserSocket } from "./types/active-user-socket";

export class SocketIOServerManager implements ISocketIOServer<Server> {
  _socketServer: Server;
  private activeSockets = new Map<string, ActiveUserSocket>();

  setInstance(config?: http.Server | number): SocketIOServerManager {
    if (!this._socketServer) {
      if (config) {
        this._socketServer = new Server(config);
      } else {
        this._socketServer = new Server();
      }
    }

    return this;
  }

  getInstance(): Server {
    if (!this._socketServer) {
      this.setInstance();
    }

    return this._socketServer;
  }

  registerActiveSocket(activeUserSocket: ActiveUserSocket): ActiveUserSocket {
    this.activeSockets.set(activeUserSocket[0].id, activeUserSocket);
    return activeUserSocket;
  }

  removeActiveSocket(socket: Socket): void {
    this.activeSockets.delete(socket.id);
  }

  getActiveSocket(socket: Socket): ActiveUserSocket | void {
    return this.activeSockets.get(socket.id);
  }

  getAllActiveSockets(): Map<string, ActiveUserSocket> {
    return this.activeSockets;
  }

  registerAllEvents(events: EventTypes[]) {
    const io = this.getInstance();
    events.forEach((event) => {
      io.on("connection", (socket) => {
        socket.on(event.name, (...args) => event.handler(socket, ...args));
      });
    });
  }
}

export default new SocketIOServerManager();
