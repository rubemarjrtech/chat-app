import "@redis/client";
import { RedisJSON } from "@redis/json/dist/commands";

declare module "@redis/client" {
  type RedisClientWithJSON = RedisClientType & RedisJSON;
}
