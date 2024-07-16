import mongoose, { Document, Model } from "mongoose";
import { FormattedMessage } from "../../utils/formatMessage";

export interface Message extends FormattedMessage, Document {
  room: string;
  createdAt: string;
}

const messageSchema = new mongoose.Schema<Message, Model<Message>>(
  {
    username: { type: String, required: true },
    text: { type: String, required: true },
    room: { type: String, required: true },
    createdAt: { type: String, required: true },
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

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const Message = mongoose.model("Message", messageSchema);
