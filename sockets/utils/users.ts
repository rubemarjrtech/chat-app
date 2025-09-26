import { SocketIOServerManager } from "../socket-io-server";

export type User = {
  username: string;
  room: "JavaScript" | "Python" | "PHP" | "Ruby" | "Java" | "C#";
};

export function getRoomUsers(
  room: string,
  socketIOServerManager: SocketIOServerManager
) {
  return Array.from(socketIOServerManager.getAllActiveSockets().values())
    .filter(([_, user]) => {
      return user.room === room;
    })
    .map(([_, user]) => {
      return user.username;
    });
}
