import { RedisClientWithJSON } from "@redis/client";
import { ICacheClient } from "./interfaces/ICacheClient";
import { createClient } from "redis";

class Cache implements ICacheClient {
  private redisClient: RedisClientWithJSON;

  async init(): Promise<void> {
    this.redisClient = createClient({
      url: "redis://localhost:6379",
    });
    await this.redisClient.connect();
  }

  getClient(): RedisClientWithJSON {
    return this.redisClient;
  }
}

export default new Cache();
