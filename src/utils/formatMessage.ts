import { MessageTypes } from "../database/model/message.model";

export type MessageFormat = {
  username: string;
  text: string;
  createdAt: Date;
};

export function formatMessage(username: string, text: string): MessageFormat {
  return {
    username,
    text,
    createdAt: new Date(),
  };
}

export function formatAxiosResponseMessages(
  messages: MessageTypes[]
): MessageFormat[] | void {
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
