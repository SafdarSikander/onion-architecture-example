import { IMessageRepository } from "../../domain/repositories/messageRepository";
import { IUserRepository } from "../../domain/repositories/userRepository";
import { Message } from "../../domain/entities/message";

export class PublishMessage {
  constructor(
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string, content: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const message = new Message();
    message.content = content;
    message.timestamp = new Date();
    message.user = user;

    await this.messageRepository.save(message);
  }
}
