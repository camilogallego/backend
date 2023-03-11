const router = require("express").Router();
const CartManager = require("../dao/cartManager.mongo");

const cartManager = new CartManager()

router.post("/", async (req, res) => {
  await cartManager.addCart();
  res.status(200).json({ message: "Cart added" });
});

router.get("/:cid", async (req, res) => {
  const products = await cartManager.getProductsByCartId(Number(req.params.cid));
  !products
    ? res.status(404).json({ message: "Cart not found" })
    : res.status(200).json({ products });
});

router.post("/:cid/product/:pid", async (req, res) => {
  await cartManager.addProductToCart(
    Number(req.params.cid),
    Number(req.params.pid)
  );
  res.status(200).json({ message: "Product added successfully" });
});

module.exports = router;
