import { Repository, getRepository } from "typeorm";
import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/userRepository";
import { AppDataSource } from "../../config/dataSource";

export class TypeOrmUserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async save(user: User): Promise<void> {
    await this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }
}
