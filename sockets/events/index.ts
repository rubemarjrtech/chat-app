import { EventTypes } from "../types/event-types";
import chatMessage from "./chat-message";

const events: EventTypes[] = [{ name: "chatMessage", handler: chatMessage }];

export default events;
