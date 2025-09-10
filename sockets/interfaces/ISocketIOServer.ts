import { EventTypes } from "../types/event-types";
import { IDefaultSocketServer } from "./IDefaultSocketServer";

export interface ISocketIOServer<T> extends IDefaultSocketServer<T> {
  registerAllEvents(events: EventTypes[]): void;
}
