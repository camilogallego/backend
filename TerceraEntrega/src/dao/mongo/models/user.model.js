import { Schema, model } from "mongoose";

const userCollection = "Users";


const userSchema = Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  rol: { type: String },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
});

const userModel = model(userCollection, userSchema);

export default userModel;
