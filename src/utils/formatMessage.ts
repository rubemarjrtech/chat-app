import moment from "moment";
import { MessageTypes } from "../database/model/message.model";
import { AxiosResponse } from "axios";

export interface FormattedMessage {
  username: string;
  text: string;
  createdAt: string;
}

export function formatMessage(
  username: string,
  text: string
): FormattedMessage {
  return {
    username,
    text,
    createdAt: moment().format("h:mm a"),
  };
}

export function formatAxiosResponseMessages(
  messages: AxiosResponse<MessageTypes | MessageTypes[]>
): FormattedMessage[] | void {
  if (!!Array.isArray(messages)) {
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

  return;
}
