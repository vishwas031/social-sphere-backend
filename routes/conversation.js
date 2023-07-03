import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/auth.js";
import { getAllConversation, newConversation, getConversation } from "../controllers/conversation.js";


router.post("/", verifyToken, newConversation);

router.get("/:userId", verifyToken, getAllConversation);

router.get("/find/:firstUserId/:secondUserId", getConversation)

export default router;