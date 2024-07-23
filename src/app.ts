import express, { Application, json } from "express";
import path from "path";
import { connectDb } from "./database";
import { router } from "./routes";

export class App {
  public readonly app: Application;
  constructor() {
    this.app = express();
  }

  public async init(): Promise<void> {
    await this.initDatabase();
    this.middlewares();
    this.routes();
  }

  private async initDatabase() {
    console.log("Trying to connect to database...");
    await connectDb();
  }

  private middlewares(): void {
    this.app.use(json());
    this.app.use(express.static(path.join(__dirname, "..", "public")));
  }

  private routes() {
    this.app.use("/api", router);
  }
}
