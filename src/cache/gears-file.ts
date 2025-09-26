import fs from "fs";
import { RedisJSON } from "@redis/json/dist/commands";
import cache from "../cache";
import { RoomMessage } from "../types/room-message";

export async function setupGears() {
  const requirements = ["rgsync", "pymongo==4.1.1"];
  const writeBehindCode = fs
    .readFileSync("./src/write-behind.py")
    .toString()
    .replace(
      "%MONGODB_CONNECTION_URL%",
      "mongodb://mongo:27017/chatcord?serverSelectionTimeoutMS=30000&connectTimeoutMS=30000"
    );

  const params = [
    "RG.PYEXECUTE",
    writeBehindCode,
    "REQUIREMENTS",
    ...requirements,
  ];

  try {
    const redisClient = cache.getClient();
    await redisClient.sendCommand(params);
    console.log("Redis write-behind setup complete");
  } catch (error) {
    console.log("Redis write-behind setup failed");
    console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 4));
  }
}

export async function setMessage(roomMessage: RoomMessage) {
  const key = `message:${roomMessage.messageId}`;
  const redisClient = cache.getClient();
  await redisClient.json.set(key, "$", {
    ...roomMessage,
  } as RedisJSON);
}
