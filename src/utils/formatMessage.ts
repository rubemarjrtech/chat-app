import moment from "moment";
import { MessageTypes } from "../database/model/message.model";

export interface FormattedMessage {
  username: string;
  text: string;
  createdAt: Date;
}

export function formatMessage(
  username: string,
  text: string
): FormattedMessage {
  return {
    username,
    text,
    createdAt: new Date(),
  };
}

export function formatAxiosResponseMessages(
  messages: MessageTypes[]
): FormattedMessage[] | void {
  const messagesArr = messages.map((message) => {
    const formattedMessage = {
      username: message.username,
      text: message.text,
      createdAt: message.createdAt,
    };

    return formattedMessage;
  });

  return messagesArr;
}
