import { RedisClientType } from "@redis/client";
import { ICacheClient } from "./interfaces/ICacheClient";
import { createClient, RedisDefaultModules } from "redis";

class Cache implements ICacheClient {
  private redisClient: RedisClientType<RedisDefaultModules>;

  async init(): Promise<void> {
    this.redisClient = createClient({
      url: "redis://localhost:6379",
    });
    await this.redisClient.connect();
  }

  getClient(): RedisClientType<RedisDefaultModules> {
    return this.redisClient;
  }
}

export default new Cache();
