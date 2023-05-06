import { promises } from "fs";
import ProductManager from "./productManager";
import productos from "../../data/productos.json"

const productManager = new ProductManager(productos);

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async getCarts() {
    try {
      return JSON.parse(await promises.readFile(this.path, "utf-8"));
    } catch (error) {
      console.error(error);
    }
  }

  async getProductsById(id) {
    try {
      this.carts = await this.getCarts();
      let x = this.carts.find((cart) => cart.id === id);
      if (x === undefined) {
        await this.addCart(id);
        return this.carts.find((cart) => cart.id === id).products;
      } else {
        return this.carts.find((cart) => cart.id === id).products;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addCart(cid) {
    try {
      this.carts = await this.getCarts();
      const id =
        this.carts.length === 0 ? 1 : this.carts[this.carts.length - 1].id + 1;
      if (cid) {
        this.carts.push({ id: cid, products: [] });
      } else {
        this.carts.push({ id: id, products: [] });
      }
      return await promises.writeFile(this.path, JSON.stringify(this.carts));
    } catch (error) {
      console.error(error);
    }
  }

  async addProductToCart(cid, pid) {
    const prod = await productManager.getProductById(pid);
    const cart = await this.getProductsById(cid);
    if (cart.some((item) => item.product === prod.id)) {
      const index = cart.findIndex((item) => item.product === prod.id);
      cart[index].quantity++;
    } else {
      cart.push({ product: prod.id, quantity: 1 });
    }
    return await promises.writeFile(this.path, JSON.stringify(this.carts));
  }
}
export default CartManager;
