import { Socket } from "socket.io";

export interface User {
  id: Socket["id"];
  username: string;
  room: "JavaScript" | "Python" | "PHP" | "Ruby" | "Java" | "C#";
}

const users: User[] = [];

// Join user to chat
export function userJoin({ id, username, room }: User): User {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
export function getCurrentUser(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

// User leaves chat
export function userLeave(id: string): User | void {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getRoomUsers(room: string): User[] {
  return users.filter((user) => user.room === room);
}
