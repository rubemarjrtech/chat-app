import express, { Application, json } from "express";
import { IFrameworkClient } from "../interfaces/IFrameworkClient";
import path from "path";
import { router } from "../routes";

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
    this.instance.use("/api", router);
    this.instance.use(json());
    this.instance.use(express.static(path.join(__dirname, "..", "public")));
  }
}

export default new Framework();
