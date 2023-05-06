import { Schema, model } from "mongoose";
const cartCollection = "Carts"

const cartSchema = new Schema({
  cartId: { type: String, required: true, unique: true },
  products: {
    type: [
      {
        productId: String,
        product: {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          require: true,
          default: 0,
        },
      },
    ],
    default: [],
  },
});

cartSchema.pre("find", function () {
  this.populate("products.product");
});
const cartModel = model(cartCollection, cartSchema);

export default cartModel;