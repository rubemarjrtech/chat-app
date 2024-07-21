import mongoose from "mongoose";
import { FormattedMessage } from "../../utils/formatMessage";

export interface MessageTypes extends FormattedMessage {
  room: string;
}

const messageSchema = new mongoose.Schema<MessageTypes>(
  {
    room: { type: String },
    username: { type: String },
    text: { type: String },
    createdAt: { type: Date },
  },
  {
    toJSON: {
      transform: (_, ret: any): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Message = mongoose.model<MessageTypes>("Message", messageSchema);
