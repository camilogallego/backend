import { Router } from "express";
import ProductController from "../dao/mongo/controllers/product.controller";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/filter", ProductController.filterProducts);
router.get("/:pid", ProductController.getProductById);
router.post("/", ProductController.addProduct);
router.put("/:pid", ProductController.updateProduct);
router.delete("/:pid", ProductController.deleteProduct);

export default router;
