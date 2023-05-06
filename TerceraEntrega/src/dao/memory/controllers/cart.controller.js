import path from "path";
import CartManager from "../services/cartManager.js";
import carrito from "../../data/cart.json"

const filePath = carrito;
const cart = new CartManager(filePath);

export async function addCart(req, res) {
  try {
    const response = await cart.addCart();
    res.json({
      ok: true,
      message: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function getCartById(req, res) {
  const { cid } = req.params;
  try {
    const response = await cart.getCartById(cid);
    res.json({
      ok: true,
      cart: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const response = await cart.addProduct(cid, pid);
    res.json({
      ok: true,
      message: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}
