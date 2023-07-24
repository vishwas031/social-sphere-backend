import Conversation from "../models/Conversation.js";

// new Conversation
export  const newConversation = async (req,res)=>
{
    const newConversation = new Conversation({
        member: [req.body.senderId,req.body.receiverId],
    });
    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }catch(err){
        res.status(500).json(err);
    }
}

// get Conversation of a user
export const getAllConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      member: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
}


// get conv includes two userId

export const getConversation = async (req, res) => {
  try {
    var conversation = await Conversation.findOne({
      member: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    if(conversation==null)
    {
      const newConversation = new Conversation({
          member: [req.params.firstUserId,req.params.secondUserId],
      });
      conversation = await newConversation.save();

    }
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
}