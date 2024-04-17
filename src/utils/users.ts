const users: any = [];

// Join user to chat
export function userJoin(id: string, username: string, room: string) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
export function getCurrentUser(id: string) {
  return users.find((user: any) => user.id === id);
}

// User leaves chat
export function userLeave(id: string) {
  const index = users.findIndex((user: any) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getRoomUsers(room: string) {
  return users.filter((user: any) => user.room === room);
}
