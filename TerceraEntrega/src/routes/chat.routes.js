import { Router } from "express";
import MessageServiceDao from "../dao/mongo/services/chat.services"

const router = Router();

const chatManager = new MessageServiceDao();

router.post("/", async (req, res) => {
  const { user, message } = req.body;
  await chatManager.addMessage(user, message);
  res.status(200).json({ message: "Message sent" });
});

router.get("/", async (req, res) => {
  const messages = await chatManager.getMessages();
  res.render("chat", { messages });
});

export default router;
