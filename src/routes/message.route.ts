import { Router } from "express";
import { MessageController } from "../controllers/message.controller";

export const messageRoutes = Router();
const messageController = new MessageController();

messageRoutes.get("/messages", messageController.find);
messageRoutes.post("/messages", messageController.create);
