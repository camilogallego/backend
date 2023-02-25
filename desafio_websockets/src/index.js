const express = require("express");
const productsRouter = require("./routers/productsRouter");
const cartsRouters = require("./routers/cartsRouters");
const handlebars = require("express-handlebars");
const path = require("path");

const { Server } = require("socket.io");
const ProductManager = require("./productManager");

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);
const socketServer = new Server(httpServer);
const productManager = new ProductManager("src/data/productos.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouters);

app.get("/realtimeproducts", async (req, res) =>
  res.status(200).render("realTimeProducts")
);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("products", products);
  
  socket.on("addProd", async (prod) => {
   let addedProduct = await productManager.addProduct(prod);
    socketServer.emit("addedProduct", addedProduct);
  })
  
  socket.on("delProduct", async (id,code,name) => {
    console.log("on", id, code, name);
    let removedProduct = await productManager.deleteProduct(id);
    socket.emit("removedProduct", {removedProduct,code,name});
  });
});
