import mongoose from "mongoose";
import { IDatabaseClient } from "./interfaces/IDatabaseClient";

class Database implements IDatabaseClient {
  private dbClient = mongoose;

  async init(): Promise<void> {
    await this.dbClient.connect(process.env.MONGO_CONNECTION as string);
  }

  async stop(): Promise<void> {
    await this.dbClient.connection.close();
  }
}

export default new Database();
