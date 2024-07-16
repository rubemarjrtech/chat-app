import mongoose, { Mongoose } from "mongoose";

export const connectDb = async (): Promise<Mongoose> =>
  await mongoose.connect("mongodb://localhost:27017/chatcord");

export const closeDbConnection = async (): Promise<void> =>
  await mongoose.connection.close();
