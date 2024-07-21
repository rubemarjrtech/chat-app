import { Router } from "express";
import { messageRoutes } from "./message.route";

export const router = Router();

router.use("/chatcord", messageRoutes);
