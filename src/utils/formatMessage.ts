import { MsgWithoutRoomMsgId, RoomMessage } from "../types/room-message";

export function formatMessage(
  username: string,
  text: string
): MsgWithoutRoomMsgId {
  return {
    username,
    text,
    createdAt: new Date(),
  };
}

export function formatAxiosResponse(
  data: RoomMessage[]
): MsgWithoutRoomMsgId[] {
  return data.map((message) => {
    return {
      username: message.username,
      text: message.text,
      createdAt: message.createdAt,
    };
  });
}
