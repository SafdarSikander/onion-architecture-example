import { Request, Response } from "express";
import { PublishMessage } from "../../application/useCases/publishMessage";
import { GetMessages } from "../../application/useCases/getMessages";
import { IMessageRepository } from "../../domain/repositories/messageRepository";
import { IUserRepository } from "../../domain/repositories/userRepository";
import { AppError } from "../../utils/AppError";

export class MessageController {
  constructor(
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository
  ) {}

  async publishMessage(req: Request, res: Response) {
    const { userId, content } = req.body;

    if (!userId || !content) {
      throw new AppError("UserId and content are required", 400);
    }

    const useCase = new PublishMessage(
      this.messageRepository,
      this.userRepository
    );
    await useCase.execute(userId, content);
    res.status(201).send("Message published");
  }

  async getMessages(req: Request, res: Response) {
    const useCase = new GetMessages(this.messageRepository);
    const messages = await useCase.execute();
    res.status(200).json(messages);
  }
}
