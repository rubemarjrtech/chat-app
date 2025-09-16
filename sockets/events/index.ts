import { EventTypes } from "../types/event-types";
import chatMessage from "./chat-message";
import { disconnect } from "./disconnect";
import joinRoom from "./join-room";

const events: EventTypes[] = [
  { name: "chatMessage", handler: chatMessage },
  { name: "joinRoom", handler: joinRoom },
  { name: "disconnect", handler: disconnect },
];

export default events;
