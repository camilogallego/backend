import CartServiceDao from "../services/cart.services.js";
import ProductService from "../services/product.services.js";
import ticketModel from "../models/ticket.model.js";
import { ErrorsHTTP } from "../services/error.handle.js"

const cartServiceDao = new CartServiceDao();
const httpResp = new ErrorsHTTP();

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
      return httpResp.Created(res, "Create Cart");
    } catch (error) {
      return httpResp.Error(res, "Error create Cart")

    }
  }

  async getProductsByCartId(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartServiceDao.getProductsByCartId(cartId);
      return httpResp.ok(res, {cart})
    } catch (error) {
      return httpResp.Error(res, "Error getting the product");
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      await cartServiceDao.addProductToCart(cartId, productId);
      return httpResp.OK(res, "Product added to cart");
    } catch (error) {
      return httpResp.Error(res, "Error adding product to cart");
    }
  }

  async delProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      await cartServiceDao.delProductFromCart(cartId, productId);
      return httpResp.OK(res, "Product delete of the cart");
    } catch (error) {
      return httpResp.Error(res, "Error deleting cart");
      
    }
  }

  async delProducts(req, res) {
    const cartId = req.params.cid;
    try {
      await cartServiceDao.delProducts(cartId);
      return httpResp.OK(res, "Products delete of the cart")
    } catch (error) {
      return httpResp.Error(res, "Error removing products from cart");
    }
  }

  async updateQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
      await cartServiceDao.updateQuantity(cartId, productId, quantity);
      return httpResp.OK(res, "Quantity update");
    } catch (error) {
      return httpResp.Error(res, "Error updating cart quantity");
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

      return httpResp.OK({
        res,
        message: "Successful purchase",
        ticket,
        productsNotPurchased: productsToRemove,
      });
    } catch (error) {
      return httpResp.Error(res, "error when making the purchase of the cart");
    }
  }
}

export default CartController;
