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
