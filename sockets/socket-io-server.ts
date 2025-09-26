import { Server, Socket } from "socket.io";
import * as http from "http";
import { EventTypes } from "./types/event-types";
import { ISocketIOServer } from "./interfaces/ISocketIOServer";
import { ActiveUserSocket } from "./types/active-user-socket";
import { User } from "./utils/users";

export class SocketIOServerManager implements ISocketIOServer<Server> {
  _socketServer: Server;
  private activeSockets = new Map<string, ActiveUserSocket>();

  setInstance(serverConfig?: http.Server | number): SocketIOServerManager {
    const otherConfig = {
      pingTimeout: 7000,
      pingInterval: 12000,
    };

    if (!this._socketServer) {
      if (serverConfig) {
        this._socketServer = new Server(serverConfig, otherConfig);
      } else {
        this._socketServer = new Server(otherConfig);
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

  removeActiveSocket(socket: Socket): User | null {
    const activeUserSocket = this.getActiveSocket(socket);
    if (!activeUserSocket) return null;
    const [activeSocket, user] = activeUserSocket;

    this.activeSockets.delete(activeSocket.id);

    return user;
  }

  getActiveSocket(socket: Socket): ActiveUserSocket | void {
    return this.activeSockets.get(socket.id);
  }

  getAllActiveSockets(): Map<string, ActiveUserSocket> {
    return this.activeSockets;
  }

  registerAllEvents(events: EventTypes[]) {
    const io = this.getInstance();
    // leaving room to deal with more system events later
    const systemEvents = ["disconnect"];

    for (const event of events) {
      io.on("connection", (socket) => {
        if (systemEvents.includes(event.name) && event.name === "disconnect") {
          socket.on("disconnect", (reason) => event.handler(socket, reason));
        } else {
          socket.on(event.name, (...args) => event.handler(socket, ...args));
        }
      });
    }
  }
}

export default new SocketIOServerManager();
