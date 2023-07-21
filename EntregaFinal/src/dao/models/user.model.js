import { Schema, model } from "mongoose";

const collection = "Users";

const schema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    index: true
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      }
    ],
    default: [],
  },
  age: Number,
  address: String,
  password: String,
  role: String,
  cart:{
    type: Schema.Types.ObjectId,
    ref: "Carts"
  },
  last_connection: {
    type: Schema.Types.Date,
    default: () => Date.now()
  },
  is_validated: {
    type: Schema.Types.Boolean,
    default: false
  }
});

const userModel = model(collection, schema);
export default userModel;
