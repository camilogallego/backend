import { Router } from "express";
import { generateProduct } from "../utils/generate-product.js";

const router = Router();

router.get("/", async (req, res) => {
  let products = [];
  for (let index = 0; index < 100; index++) {
    products.push(generateProduct());
  }
  return res.json({
    message: `generate product`,
    products,
  });
});

export default router;
