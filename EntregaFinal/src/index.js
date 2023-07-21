import App from "./app.js";
import viewsRoutes from "./routes/views.routes.js";
import CartsRoutes from "./routes/cart.routes.js";
import ProductsRoutes from "./routes/products.routes.js";
import SessionRoutes from "./routes/session.routes.js";
import TicketRoutes from "./routes/ticket.routes.js";
import MockRoutes from "./routes/mock.routes.js";
import LogsRoutes from "./routes/logs.routes.js";
import UserRoutes from "./routes/user.routes.js";

const app = new App([
  new viewsRoutes(),
  new CartsRoutes(),
  new ProductsRoutes(),
  new SessionRoutes(),
  new TicketRoutes(),
  new MockRoutes(),
  new LogsRoutes(),
  new UserRoutes(),
]);

app.listen();
