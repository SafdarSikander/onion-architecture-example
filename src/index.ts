import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/dataSource";
import routes from "./presentation/routes";
import { RedisStreamService } from "./infrastructure/redis/redisStreamService";
import { TypeOrmMessageRepository } from "./infrastructure/database/typeormMessageRepository";
import { TypeOrmUserRepository } from "./infrastructure/database/typeormUserRepository";
import { PublishMessage } from "./application/useCases/publishMessage";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", routes);

const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Redis Stream Consumer
    const redisStreamService = new RedisStreamService();
    const messageRepository = new TypeOrmMessageRepository();
    const userRepository = new TypeOrmUserRepository();
    const publishMessageUseCase = new PublishMessage(
      messageRepository,
      userRepository
    );

    redisStreamService.consumeMessages("messageStream", async (message) => {
      const { userId, content } = JSON.parse(message);
      await publishMessageUseCase.execute(userId, content);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
