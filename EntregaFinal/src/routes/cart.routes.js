import { Router } from "express";
import { API_VERSION } from '../config/config.js';
import CartController from '../controllers/cart.controller.js';
import authMdw from "../middleware/auth.middleware.js";
import handlePolicies from "../middleware/handlePolicies.middleware.js";
import { policies } from '../middleware/constants.js';
class CartsRoute {
  path = `/api/${API_VERSION}/carts`;
  router = Router();
  controller = new CartController()

  constructor() {
    this.initCartsRoutes();
  }

  initCartsRoutes() {
    this.router.param("cid", this.controller.validateCIDParam);
    this.router.param("pid", this.controller.validatePIDParam);
    this.router.get(`${this.path}/:cid`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.getProductsByCart);
    this.router.post(`${this.path}`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.createCart);
    this.router.post(`${this.path}/:cid/product/:pid`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.addProductToCart);
    this.router.put(`${this.path}/:cid/product/:pid`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.validateQuantity,this.controller.updateProductQuantity);
    this.router.delete(`${this.path}/:cid/product/:pid`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.deleteProductFromCart);
    this.router.delete(`${this.path}/:cid`, authMdw, handlePolicies([policies.USER, policies.PREMIUM,]), this.controller.deleteAllproductsFromCart);
    this.router.put(`${this.path}/:cid`, authMdw,this.controller.validateNewProducts, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.updateProductsFromCart);
    this.router.post(`${this.path}/:cid/purchase`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.purchaseProducts);
  }
}

export default CartsRoute;
