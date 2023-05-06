import messageModel from "../models/index.js";

class MessageServiceDao {
  addMessage = async (user, message) => {
    await messageModel.create({ user, message });
  };
  getMessages = async () => {
    const messages = await messageModel.find({}).lean();
    return messages;
  };
}

export default MessageServiceDao;
