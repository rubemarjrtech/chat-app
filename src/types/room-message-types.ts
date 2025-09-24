import { MessageFormat } from "./message-format";

export type RoomMessageTypes = MessageFormat & {
  room: string;
};
