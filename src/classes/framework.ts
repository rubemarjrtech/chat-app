import express, { Application, json } from "express";
import { IFrameworkClient } from "../interfaces/IFrameworkClient";
import { router } from "../routes";
import helmet from "helmet";
import cors from "cors";

class Framework implements IFrameworkClient<Application> {
  instance: Application;

  constructor() {
    this.setFramework();
  }

  getInstance(): Application {
    return this.instance;
  }

  setFramework(): void {
    if (!this.instance) {
      this.instance = express();
    }
  }

  configure(): void {
    this.instance.use(helmet());
    this.instance.use(
      cors({
        origin: process.env.REQUESTS_ORIGIN,
      })
    );
    this.instance.use(json());
    this.instance.use("/api", router);
  }
}

export default new Framework();
