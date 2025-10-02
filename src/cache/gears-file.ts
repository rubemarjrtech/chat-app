import fs from "fs";
import { RedisJSON } from "@redis/json/dist/commands";
import cache from "../cache";
import { RoomMessage } from "../types/room-message";

export async function setupGears() {
  const requirements = ["rgsync", "pymongo==4.1.1", "python-decouple==3.8"];
  const writeBehindCode = fs
    .readFileSync("./src/write-behind.py")
    .toString()
    .replace("%MONGODB_URL%", process.env.GEARS_CONNECTION as string);

  const params = [
    "RG.PYEXECUTE",
    writeBehindCode,
    "REQUIREMENTS",
    ...requirements,
  ];

  const redisClient = cache.getClient();
  await redisClient.sendCommand(params);
  console.log("Redis write-behind setup complete");
}

export async function setMessage(roomMessage: RoomMessage) {
  const key = `message:${roomMessage.messageId}`;
  const ttlInSeconds = 30;
  const redisClient = cache.getClient();
  await redisClient
    .multi()
    .json.set(key, "$", {
      ...roomMessage,
    } as RedisJSON)
    .expire(key, ttlInSeconds)
    .exec();
}
