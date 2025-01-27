import { IMessageRepository } from "../../domain/repositories/messageRepository";
import { Message } from "../../domain/entities/message";

export class GetMessages {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(): Promise<Message[]> {
    return this.messageRepository.findAll();
  }
}
