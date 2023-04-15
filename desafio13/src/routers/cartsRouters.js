const router = require("express").Router();
const CartManager = require("../dao/cartManager.mongo");

const cartManager = new CartManager()

router.post("/", async (req, res) => {
  await cartManager.addCart();
  res.status(200).json({ message: "Cart added" });
});

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getProductsByCartId(req.params.cid);
  res.status(200).render("cart",{cart})
});

router.post("/:cid/product/:pid", async (req, res) => {
  await cartManager.addProductCart(req.params.cid,req.params.pid);
  res.status(200).json({ message: "Product added successfully" });
});

router.put("/:cid/products/:pid", async (req, res) => {
  await cartManager.updateQuantity(req.params.cid,req.params.pid, req.body.quantity)
  res.status(200).json({message: "updated quantity"})
});

router.delete("/:cid", async (req,res) =>{
  await cartManager.delProducts(req.params.cid)
  res.status(200).json({message: "empty card"})
});

router.delete("/:cid/products/:pid", async (req, res) => {
  await cartManager.delProductFromCart(req.params.cid, req.params.pid)
  res.status(200).json({ message: "product deleted"})
});
module.exports = router;
