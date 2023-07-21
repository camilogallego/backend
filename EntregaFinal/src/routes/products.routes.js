import { Router } from "express";
import ProductsController from '../controllers/products.controller.js';
import { API_VERSION } from '../config/config.js';
import authMdw from "../middleware/auth.middleware.js";
import handlePolicies from "../middleware/handlePolicies.middleware.js";
import { policies } from '../middleware/constants.js';
class ProductRoutes {
    path = `/api/${API_VERSION}/products`;
    router = Router();
    controller = new ProductsController();

    constructor() {
        this.initProductsRoutes();
    }

    initProductsRoutes() {
        this.router.param(`pid`, this.controller.validatePIDParam)
        this.router.get(`${this.path}`,authMdw, this.controller.validateGetProductsQueryParams, handlePolicies([policies.ADMIN, policies.PREMIUM, policies.USER]), this.controller.getProducts);
        this.router.post(`${this.path}`,authMdw, this.controller.validateBodyForAddProduct, handlePolicies([policies.ADMIN, policies.PREMIUM]), this.controller.addProduct);
        this.router.get(`${this.path}/insertion`,authMdw,handlePolicies([policies.ADMIN, policies.PREMIUM]), this.controller.insertion);
        this.router.delete(`${this.path}/:pid`,authMdw, handlePolicies([policies.ADMIN, policies.PREMIUM]), this.controller.deleteProduct);
        this.router.put(`${this.path}/:pid`,authMdw, this.controller.validateNewPropsForUpdateProducts, handlePolicies([policies.ADMIN, policies.PREMIUM]), this.controller.updateProduct);
    }
}

export default ProductRoutes;
