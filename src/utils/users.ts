import { Socket } from "socket.io";
import { SocketServerManager } from "../../sockets/socket-server";

export type User = {
  id: Socket["id"];
  username: string;
  room: "JavaScript" | "Python" | "PHP" | "Ruby" | "Java" | "C#";
};

const users: User[] = [];

// User leaves chat
export function userLeave(id: string): User | void {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

export function getRoomUsers(
  room: string,
  socketServerManger: SocketServerManager
) {
  return Array.from(socketServerManger.getAllActiveSockets().values())
    .filter(([_, user]) => {
      return user.room === room;
    })
    .map(([_, user]) => {
      return user.username;
    });
}
