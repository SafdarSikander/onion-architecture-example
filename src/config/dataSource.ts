import { DataSource } from "typeorm";
import { Message } from "../domain/entities/message";
import { User } from "../domain/entities/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Message, User],
  migrations: [],
  subscribers: [],
});
