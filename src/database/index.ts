import mongoose from "mongoose";
import { IDatabaseClient } from "./interfaces/IDatabaseClient";

class Database implements IDatabaseClient {
  private dbClient = mongoose;

  async init(): Promise<void> {
    await this.dbClient.connect("mongodb://localhost:27017/chatcord");
  }

  async stop(): Promise<void> {
    await this.dbClient.connection.close();
  }
}

export default new Database();
