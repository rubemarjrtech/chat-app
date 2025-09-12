import { Application } from "express";
import database from "./database";
import { setupGears } from "./redis/gears-file";
import { ICacheClient } from "./cache/interfaces/ICacheClient";
import cache from "./cache";
import { IDatabaseClient } from "./database/interfaces/IDatabaseClient";
import { IFrameworkClient } from "./interfaces/IFrameworkClient";
import framework from "./classes/framework";

class App {
  private cacheClient: ICacheClient;
  private dbClient: IDatabaseClient;
  private framework: IFrameworkClient<Application>;

  constructor() {
    this.cacheClient = cache;
    this.dbClient = database;
    this.framework = framework;
  }

  public async configure(): Promise<void> {
    await this.dbClient.init();
    await this.cacheClient.init();
    this.framework.configure();
    await setupGears();
  }

  getFramework() {
    return this.framework.getInstance();
  }
}

export default new App();
