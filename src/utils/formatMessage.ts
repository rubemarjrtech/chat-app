import { RoomSchemaTypes } from "../database/model/message.model";
import { MessageFormat } from "../types/message-format";

export function formatMessage(username: string, text: string): MessageFormat {
  return {
    username,
    text,
    createdAt: new Date(),
  };
}

export function formatAxiosResponseMessages(
  data: RoomSchemaTypes
): MessageFormat[] {
  return data.messages.map((message) => message);
}
