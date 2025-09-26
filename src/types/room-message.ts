export type RoomMessage = {
  username: string;
  text: string;
  room: string;
  createdAt: Date;
  messageId: string;
};
export type MsgWithoutRoomMsgId = Omit<RoomMessage, "room" | "messageId">;
