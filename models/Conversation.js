// here we define Conversation object, the way the our Conversation object will look like in database

import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema(
    {
     member: {
        type: Array,
     }
    },
    { timestamps: true }
  );

const Conversation = mongoose.model("Conversation", ConversationSchema)
export default Conversation;