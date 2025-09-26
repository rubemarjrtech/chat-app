import mongoose from "mongoose";
import { RoomMessage } from "../../types/room-message";

const roomSchema = new mongoose.Schema<RoomMessage>(
  {
    room: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, required: true },
    messageId: { type: String, required: true, unique: true },
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

roomSchema.index({ room: 1, messageId: 1 }, { unique: true });
roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export const RoomMessages = mongoose.model<RoomMessage>(
  "room_messages",
  roomSchema
);
