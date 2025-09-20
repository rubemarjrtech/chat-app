import { Socket } from "socket.io";
import { User } from "../../src/utils/users";

export type ActiveUserSocket = [socket: Socket, user: User];
