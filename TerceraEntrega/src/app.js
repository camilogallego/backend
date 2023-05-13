dotenv.config();
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import displayRoutes from "express-routemap";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import * as dotenv from "dotenv";
import { BASE_PREFIX, PORT, MONGO_URL } from "../config/config.js";

import cartRouter from "./routes/cart.routes.js";
import chatRouter from "./routes/chat.routes.js";
import productsRouter from "./routes/product.routes.js";
import authRouter from "./routes/auth.routes.js";
import viewsRouter from "./routes/view.routes.js";
import mockRouter from './routes/mock.router.js'

import productModel from "./dao/mongo/models/product.model.js";
import ProductServiceDao from "./dao/mongo/services/product.services.js";
const productManager = new ProductServiceDao();

import messageModel from "./dao/mongo/models/chat.model.js";
import MessageServiceDao from "./dao/mongo/services/chat.services.js";
const chatManager = new MessageServiceDao()


const app = express();

const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Listening on ${PORT}`);
});
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 3600,
    }),
    secret: "secretSession",
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 3600,
      sameSite: "strict",
      secure: true,
    },
  })
);
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.use(express.static(`${__dirname}/public`));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use(`/${BASE_PREFIX}`, viewsRouter);
app.use(`/${BASE_PREFIX}/products`, productsRouter);
app.use(`/${BASE_PREFIX}/carts`, cartRouter);
app.use(`/${BASE_PREFIX}/messages`, chatRouter);
app.use(`/${BASE_PREFIX}/session`, authRouter);
app.use(`/mockproducts`, mockRouter);


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
    let newProduct = await productManager.getProducts();
    socketServer.emit("products", newProduct);
  });

  // elimina producto
  socket.on("delProduct", async (id, code, name) => {
    let removedProduct = await productManager.deleteProduct(id);
    socket.emit("removedProduct", { removedProduct, code, name });
    let updateProducts = await productManager.getProducts();
    socketServer.emit("products", updateProducts);
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

mongoose.connect(MONGO_URL);

