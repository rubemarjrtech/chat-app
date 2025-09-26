import { Socket } from "socket.io";
import { User } from "../utils/users";

export type ActiveUserSocket = [socket: Socket, user: User];
