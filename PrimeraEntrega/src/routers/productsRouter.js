const router = require("express").Router();
const ProductManager = require("../productManager");

const productManager = new ProductManager("src/data/productos.json");

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit);
  const products = await productManager.getProducts();
  limit
    ? res.status(200).json(products.slice(0, limit))
    : res.status(200).json(products);
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