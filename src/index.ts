import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/dataSource";
import routes from "./presentation/routes";
import { RedisStreamService } from "./infrastructure/redis/redisStreamService";
import { TypeOrmMessageRepository } from "./infrastructure/database/typeormMessageRepository";
import { TypeOrmUserRepository } from "./infrastructure/database/typeormUserRepository";
import { PublishMessage } from "./application/useCases/publishMessage";
import { AppError } from "./utils/AppError";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api", routes);

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    // Handle operational errors (errors we throw ourselves)
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

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
