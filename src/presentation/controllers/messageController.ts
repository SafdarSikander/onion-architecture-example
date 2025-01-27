import { Request, Response } from "express";
import { PublishMessage } from "../../application/useCases/publishMessage";
import { GetMessages } from "../../application/useCases/getMessages";
import { TypeOrmMessageRepository } from "../../infrastructure/database/typeormMessageRepository";
import { TypeOrmUserRepository } from "../../infrastructure/database/typeormUserRepository";

export class MessageController {
  private messageRepository = new TypeOrmMessageRepository();
  private userRepository = new TypeOrmUserRepository();

  async publishMessage(req: Request, res: Response) {
    const { userId, content } = req.body;
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
