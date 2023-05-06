import { Schema, model } from "mongoose";
const chatsCollection = "Messages";

const messageSchema = new Schema({
  user: {
    type: String,
    require: true
  },
  message: String,
});

const messageModel = model(chatsCollection, messageSchema);

export default messageModel;
