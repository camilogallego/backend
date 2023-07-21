import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import displayRoutes from "express-routemap";
import handlebars from "express-handlebars";
import path from "path";
import corsConfig from "./config/cors.config.js";
import { mongoDBconnection } from "./db/mongo.config.js";
import { configConnection } from "./db/mongo.config.js";
import { ProductsService } from "./services/index.js";
import handleErrors from "./middleware/error.middleware.js";
import { Logger } from "./helpers/index.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";
import swaggerOptions from "./config/swagger.config.js";
import messagesModel from "./dao/models/messages.model.js";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { ProductDTO } from "./dto/index.js";
import { NODE_ENV, PORT, SESSION_SECRET } from "./config/config.js";
const __dirname = path.resolve();
class App {
  app;
  env;
  port;
  server;

  constructor(routes) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = Number(PORT) || 5000;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initHandlebars();
  }

  /**
   * connectToDatabase
   */
  async connectToDatabase() {
    // TODO: Inicializar la conexion
    await mongoDBconnection();
  }

  initializeMiddlewares() {
    this.app.use(cookieParser());
    this.app.use(
      session({
        store: mongoStore.create({
          mongoUrl: configConnection.url,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 60 * 60,
        }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );
    initializePassport();
    const specs = swaggerJsdoc(swaggerOptions);
    this.app.use(
      "/apidocs",
      swaggerUIExpress.serve,
      swaggerUIExpress.setup(specs)
    );
    this.app.use(handleErrors);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(cors(corsConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, "/public")));
  }

  /**
   * initializeRoutes
   */
  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use(`/`, route.router);
    });
  }

  listenWs(httpServer) {
    const io = new Server(httpServer);

    io.on("connection", async (socket) => {
      Logger.info(`New Socket Connection`);

      socket.on("addNewProduct", async (product) => {
        const {
          title = "",
          description = "",
          code,
          price,
          status = true,
          stock,
          category = "",
          thumbnails = "",
        } = product;
        if (
          !title ||
          !description ||
          !code ||
          !price ||
          !status ||
          !stock ||
          !category ||
          !thumbnails
        ) {
          io.emit("productAdded", {
            added: false,
            product: null,
            error: "All fields are required to create a product",
          });
        }
        try {
          var regexPattern = new RegExp("true");
          const productDTO = new ProductDTO(
            title.toString(),
            description.toString(),
            Number(price),
            thumbnails,
            code.toString(),
            Number(stock),
            regexPattern.test(status),
            category.toString()
          );
          const product = await ProductsService.addProduct(productDTO);
          if (product) {
            io.emit("productAdded", {
              added: true,
              product: product,
              error: null,
            });
          }
        } catch (e) {
          io.emit("productAdded", { added: false, product: null, error: e });
        }
      });

      socket.on("message", async (message) => {
        const newMessage = await messagesModel.create({
          user: message.user,
          message: message.message,
        });

        if (newMessage) {
          const messages = await messagesModel.find({});
          io.emit("messageLogs", messages);
        }
      });

      // authenticated channel
      socket.on("authenticated", async (user) => {
        const messages = await messagesModel.find({});
        socket.broadcast.emit("newUserConnected", user);
        io.emit("loadMessages", messages);
      });
    });
  }

  /**
   * listen
   */
  listen() {
    const httpServer = this.app.listen(this.port, () => {
      displayRoutes(this.app);
      Logger.debug(`=================================`);
      Logger.debug(`======= ENV: ${this.env} =======`);
      Logger.debug(`🚀 App listening on the port ${this.port}`);
      Logger.debug(`=================================`);
    });
    this.listenWs(httpServer);
  }

  initHandlebars() {
    this.app.engine("handlebars", handlebars.engine());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "handlebars");
  }
}

export default App;
