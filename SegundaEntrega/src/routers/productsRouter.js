const router = require("express").Router();
const productModel = require("../dao/models/product.model")
const ProductManager = require("../dao/productManager.mongo");

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const { limit = 3, page = 1 } = req.query;
  const products = await productModel.paginate({}, { lean: true, limit, page });
  res.status(200).render("products", {
    status: "success",
    payload: products.docs,
    totalPages: products.totalDocs,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    page: products.page,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    prevLink: products.hasPrevPage ? "" : null,
    nextLink: products.hasNextPage ? "" : null,
  });
});

router.get("/filter", async (req, res) => {
  const {limit = 3, sort = 1} = req.query
  const products = await productManager.aggregate([{$sort: {price: sort}}, {$limit: limit}])
  res.status(200).render("products", {products})
})


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