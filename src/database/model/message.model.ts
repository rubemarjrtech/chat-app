import mongoose from "mongoose";
import { MessageFormat } from "../../types/message-format";

export type RoomSchemaTypes = {
  room: string;
  messages: MessageFormat[];
};

const roomSchema = new mongoose.Schema<RoomSchemaTypes>(
  {
    room: { type: String, unique: true },
    messages: [
      {
        username: { type: String },
        text: { type: String },
        createdAt: { type: Date },
      },
    ],
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

export const RoomMessages = mongoose.model<RoomSchemaTypes>(
  "room_messages",
  roomSchema
);
