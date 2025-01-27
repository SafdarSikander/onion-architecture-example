import express from "express";
import { MessageController } from "../controllers/messageController";

const router = express.Router();
const messageController = new MessageController();

router.post("/messages", (req, res) =>
  messageController.publishMessage(req, res)
);
router.get("/messages", (req, res) => messageController.getMessages(req, res));

export default router;
