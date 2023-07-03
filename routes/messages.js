import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/auth.js";
import { newConversation } from "../controllers/conversation.js";
import Message from "../models/Message.js";
import { getMessage, newMessage } from "../controllers/messages.js";


//add

router.post("/", newMessage);
  
//get
  
router.get("/:conversationId", verifyToken, getMessage);

export default router;