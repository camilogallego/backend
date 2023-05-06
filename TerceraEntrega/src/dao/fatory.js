import mongoose from "mongoose";
import {
  PERSISTENCE,
  MONGO_URL,
} from "../config/config.js";


export let Products;

switch (PERSISTENCE) {
  case "MONGO":
    const connection = mongoose
      .connect(MONGO_URL)
      .then((conn) => {
        console.log("CONECTADO!:");
      })
      .catch((err) => {
        console.log(err);
      });
    const { default: ProductServiceDao } = await import(
      "../repository/product.repository.js"
    );
    Products = ProductServiceDao;
    break;
  case "MEMORY":
    console.log("LOAD MEMORY SERVICE***");
    const { default: ProductServiceDao2 } = await import(
      "../repository/product.repository.js"
    );
    Products = ProductServiceDao2;
    break;
}
