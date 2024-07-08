import moment from "moment";

interface FormattedMessage {
  username: string;
  text: string;
  time: string;
}

export function formatMessage(
  username: string,
  text: string
): FormattedMessage {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}
