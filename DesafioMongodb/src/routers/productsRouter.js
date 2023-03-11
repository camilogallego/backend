const router = require("express").Router();
const ProductManager = require("../dao/productManager.mongo");

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit);
  const products = await productManager.getProducts();
  if (limit) return res.status(200).json(products.slice(0, limit));
  res.status(200).render("products", { products });
});

router.get("/:pid", async (req, res) => {
  const id = Number(req.params.pid);
  const product = await productManager.getProductById(id);
  !product
    ? res.status(404).json({ message: "not product" })
    : res.status(200).json(product);
});

router.post("/", async (req, res) => {
  await productManager.addProduct(req.body);
  res.status(200).json({ message: "Product added" });
});

router.put("/:pid", async(req,res) => {
    await productManager.updateProduct(Number(req.params.pid),req.body)
    res.status(200).json({message: "Product update"})
});

router.delete("/:pid", async(req,res) => {
    await ProductManager.deleteProduct(Number(req.params.pid))
    res.status(200).json({ message: "Product delete" });
})

module.exports = router