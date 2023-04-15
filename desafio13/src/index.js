require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const { DB_USER, DB_PASS } = process.env;
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config");

const productsRouter = require("./routers/productsRouter");
const cartsRouters = require("./routers/cartsRouters");
const messagesRouter = require("./routers/chatRouter");
const authRouter = require("./routers/authRouter")

const productModel = require("./dao/models/product.model");
const ProductManager = require("./dao/productManager.mongo");
const productManager = new ProductManager();

const messageModel = require("./dao/models/message.model");
const ChatManager = require("./dao/chatManager.mongo");
const chatManager = new ChatManager();

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);
const socketServer = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${DB_USER}:${DB_PASS}@camilocoder.7htnyca.mongodb.net/?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 360,
    }),
    secret: "s3cr3tc0der",
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/api", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouters);
app.use("/api/messages", messagesRouter);

app.get("/realtimeproducts", async (req, res) =>
  res.status(200).render("realTimeProducts")
);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  //prouctos
  const products = await productModel.find({});
  socket.emit("products", products);

  //agrega producto
  socket.on("addProd", async (prod) => {
    let addedProduct = await productManager.addProduct(prod);
    socketServer.emit("addedProduct", addedProduct);
    let newProduct = await productManager.getProducts()
    socketServer.emit("products", newProduct);
  });

  // elimina producto
  socket.on("delProduct", async (id, code, name) => {
    let removedProduct = await productManager.deleteProduct(id);
    socket.emit("removedProduct", { removedProduct, code, name });
    let uppdateProducts = await productManager.getProducts();
    socketServer.emit("products", uppdateProducts);
  });

  //chat
  const messages = await messageModel.find({});
  socket.emit("messages", messages);

  // message channel
  socket.on("message", async ({ user, message }) => {
    await chatManager.addMessage(user, message);
    let newMessage = await chatManager.getMessages();
    socket.emit("messages", newMessage);
  });

  // authenticated channel
  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUserConnected", data);
  });

});


mongoose.connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@camilocoder.7htnyca.mongodb.net/?retryWrites=true&w=majority`
);
