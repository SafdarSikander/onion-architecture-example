import { Repository } from "typeorm";
import { AppDataSource } from "../../config/dataSource";
import { Message } from "../../domain/entities/message";
import { IMessageRepository } from "../../domain/repositories/messageRepository";

export class TypeOrmMessageRepository implements IMessageRepository {
  private repository: Repository<Message>;

  constructor() {
    this.repository = AppDataSource.getRepository(Message);
  }

  async save(message: Message): Promise<void> {
    await this.repository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.repository.find({ relations: ["user"] });
  }
}
