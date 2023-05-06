import { Router } from "express";
import CartServiceDao from "../dao/mongo/services/cart.services";
import CartController from "../dao/mongo/controllers/cart.controller";

const router = Router();

const cartManager = new CartServiceDao();

router.post("/carts", CartController.addCart);
router.get("/carts/:cid", CartController.getProductsByCartId);
router.post("/carts/:cid/products/:pid", CartController.addProductToCart);
router.delete("/carts/:cid/products/:pid", CartController.delProductFromCart);
router.delete("/carts/:cid/products", CartController.delProducts);
router.put("/carts/:cid/products/:pid", CartController.updateQuantity);

router.post("/:cid/purchase", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await CartController.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const products = cart.products;
  const purchaseItems = [];
  const outOfStockItems = [];

  try {
    for (const item of products) {
      const product = await product.findById(item.productId);

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        purchaseItems.push(item);
      } else {
        outOfStockItems.push(item);
      }
    }

    const updateStockPromises = purchaseItems.map((item) =>
      products.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      })
    );
    await Promise.all(updateStockPromises);

    await CartController.purchaseCart(cartId, purchaseItems);

    if (outOfStockItems.length > 0) {
      return res.json({
        message:
          "Proceso de compra finalizado, algunos productos no tenían suficiente stock",
        purchaseItems,
        outOfStockItems,
      });
    } else {
      return res.json({
        message: "Proceso de compra finalizado exitosamente",
        purchaseItems,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al finalizar el proceso de compra" });
  }
});

export default router;