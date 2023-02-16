const express = require('express')
const productsRouter = require('./routers/productsRouter')
const cartsRouters = require('./routers/cartsRouters')


const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouters);


app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));