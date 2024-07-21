import { Request, Response } from "express";
import { Message } from "../database/model/message.model";

export class MessageController {
  public async create(req: Request, res: Response) {
    try {
      const { room, username, text, createdAt } = req.body;

      const message = new Message({
        room,
        username,
        text,
        createdAt,
      });

      await message.save();

      res.status(201).send({
        message: "Message stored successfully!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  public async find(req: Request, res: Response) {
    try {
      const room = req.query.room;

      if (!room) {
        return res.status(404).send({
          message: "room was undefined",
        });
      }
      const findMessages = await Message.find({
        room: `${room}`,
      }).exec();

      const messages = findMessages.map((message) => {
        return message.toObject();
      });

      res.status(200).json(messages);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Something went wrong",
      });
    }
  }
}
