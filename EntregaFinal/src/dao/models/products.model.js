import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const productsCollection = "Products";
import { ROLES } from '../../helpers/index.js';

const productsSchema = new Schema({
  productId: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  title: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  code: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  status: {
    type: Schema.Types.Boolean,
    required: true,
  },
  stock: {
    type: Schema.Types.Number,
    required: true,
  },
  category: {
    type: Schema.Types.String,
    required: true,
  },
  thumbnails: {
    type: [Schema.Types.String],
    default: [],
  },
  owner: {
    type: Schema.Types.String,
    default: ROLES.ADMIN
  }
});
productsSchema.plugin(mongoosePaginate);
const productsModel = model(productsCollection, productsSchema);
export default productsModel;
