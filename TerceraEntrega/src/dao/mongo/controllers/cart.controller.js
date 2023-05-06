import CartServiceDao from "../services/cart.services.js";
import ProductService from "../services/product.services.js";
import ticketModel from "../models/ticket.model.js";

const cartServiceDao = new CartServiceDao();

class CartController {
  CartServiceDao;
  ProductService;
  constructor() {
    this.CartServiceDao = new CartServiceDao();
    this.ProductService = new ProductService();
  }

  async addCart(req, res) {
    try {
      await cartServiceDao.addCart();
      return res.status(200).json({ message: "Cart create" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getProductsByCartId(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartServiceDao.getProductsByCartId(cartId);
      return res.status(200).json({ cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      await cartServiceDao.addProductToCart(cartId, productId);
      return res
        .status(200)
        .json({ message: "Product added to cart" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      await cartServiceDao.delProductFromCart(cartId, productId);
      return res
        .status(200)
        .json({ message: "Product delete of the cart" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delProducts(req, res) {
    const cartId = req.params.cid;
    try {
      await cartServiceDao.delProducts(cartId);
      return res.status(200).json({ message: "Products delete of the cart" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
      await cartServiceDao.updateQuantity(cartId, productId, quantity);
      return res
        .status(200)
        .json({ message: "Quantity update" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async purchaseCart(req, res) {
    const { cid } = req.params;

    try {
      const cart = await this.CartServiceDao.getProductsByCartId(cid);
      const productsToUpdate = [];
      const productsToRemove = [];

      for (const cartProduct of cart.products) {
        const product = await this.ProductService.getProductById(
          cartProduct.product
        );

        if (product.stock >= cartProduct.quantity) {
          product.stock -= cartProduct.quantity;
          productsToUpdate.push(product);
        } else {
          productsToRemove.push(cartProduct._id);
        }
      }

      const ticket = new ticketModel({
        code: generateTicketCode(),
        purchase_datetime: new Date(),
        amount: calculateTotalAmount(cart.products),
        purchaser: req.user.id,
      });

      await ticket.save();

      await this.CartServiceDao.removeProducts(cid, productsToRemove);
      await Promise.all(
        productsToUpdate.map((product) =>
          this.ProductService.updateProduct(product)
        )
      );

      return res.status(200).json({
        message: "Successful purchase",
        ticket,
        productsNotPurchased: productsToRemove,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default CartController;
