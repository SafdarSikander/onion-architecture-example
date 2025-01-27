import express from "express";
import { MessageController } from "../controllers/messageController";
import { catchAsync } from "../../utils/catchAsync";
import { TypeOrmMessageRepository } from "../../infrastructure/database/typeormMessageRepository";
import { TypeOrmUserRepository } from "../../infrastructure/database/typeormUserRepository";

const router = express.Router();

// Initialize repositories
const messageRepository = new TypeOrmMessageRepository();
const userRepository = new TypeOrmUserRepository();

// Initialize controller with dependencies
const messageController = new MessageController(
  messageRepository,
  userRepository
);

// Routes
// Bind methods to the controller instance
router.post(
  "/messages",
  catchAsync(messageController.publishMessage.bind(messageController))
);
router.get(
  "/messages",
  catchAsync(messageController.getMessages.bind(messageController))
);

export default router;
