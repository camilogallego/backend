const mongoose = require("mongoose")
const CartCollection = "Carts"

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity:{
          type: Number,
          require: true,
          default: 0
        }
      },
    ],
    default: [],
  },
});

const cartModel = mongoose.model(CartCollection, cartSchema);

module.exports = cartModel;