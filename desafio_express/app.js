const express = require("express");
const ProductManager = require("./productManager");

const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./productos.json");

app.get("/products", async (req, res) => {
  const limit = Number(req.query.limit);
  const products = await productManager.getProducts();
  console.log(products);
  limit
    ? res.status(200).json(products.slice(0, limit))
    : res.status(200).json(products);
});

app.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const product = await productManager.getProductById(id);
  !product
    ? res.status(404).json({ message: "not product" })
    : res.status(200).json(product);
});

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));