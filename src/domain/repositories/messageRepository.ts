import { Message } from "../entities/message";

export interface IMessageRepository {
  save(message: Message): Promise<void>;
  findAll(): Promise<Message[]>;
}
