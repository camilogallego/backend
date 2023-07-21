import { Schema, model } from "mongoose";
const cartsCollection = "Carts";

const cartsSchema = new Schema({
  cartId: {
    type: String,
    required: true,
    unique: true,
  },
  products: {
    type: [
      {
        quantity: Number,
        productId: String,
        product:{
          type: Schema.Types.ObjectId,
          ref: "Products"
        }
      }
    ],
    default: [],
  },
});

const cartsModel = model(cartsCollection, cartsSchema);
export default cartsModel;
