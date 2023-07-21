import { Schema, model } from "mongoose";

const messagesCollection = "Messages";

const messagesSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const messageModel = model(messagesCollection, messagesSchema);
export default messageModel;
