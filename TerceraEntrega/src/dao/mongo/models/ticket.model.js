import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketsCollection = "Ticket";

const ticketsSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});
ticketsSchema.plugin(mongoosePaginate);
const ticketsModel = model(ticketsCollection, ticketsSchema);
export default ticketsModel;
