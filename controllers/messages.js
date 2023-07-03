import Message from "../models/Message.js";

// new Conversation
export  const newMessage = async (req, res) => {
    const newMsg = new Message(req.body.message);
    try {
      const savedMessage = await newMsg.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  }

// get Conversation of a user
export const getMessage = async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  }