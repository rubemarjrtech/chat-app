import { Request, Response } from "express";
import { RoomMessages } from "../database/model/message.model";
import { setMessage } from "../cache/gears-file";
import { RoomMessage } from "../types/room-message";

export class MessageController {
  public async create(
    req: Request<unknown, unknown, RoomMessage>,
    res: Response
  ) {
    try {
      const { room, username, text, createdAt, messageId } = req.body;

      await setMessage({
        room,
        username,
        text,
        createdAt,
        messageId,
      });

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

      const messages = await RoomMessages.find({
        room,
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
