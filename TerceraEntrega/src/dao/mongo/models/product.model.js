import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "Products";

const productSchema = new Schema({
  productId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: Number, required: true },
  stock: { type: Number, required: true },
  thumbnails: [],
});

productSchema.plugin(mongoosePaginate)

const productModel = model(productsCollection, productSchema);

export default productModel;
