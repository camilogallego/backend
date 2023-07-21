import { Router } from "express";
import authMdw from "../middleware/auth.middleware.js";
import handlePolicies from "../middleware/handlePolicies.middleware.js";
import { policies } from '../middleware/constants.js';
import MocksController from '../controllers/mocks.controller.js';

class MockRoutes {
    path = `/`;
    router = Router();
    controller = new MocksController();

    constructor() {
        this.initMockRoutes();
    }

    initMockRoutes() {
        this.router.get(`${this.path}mockingproducts`,authMdw, handlePolicies([policies.PUBLIC]), this.controller.getMockProducts);
    }
}

export default MockRoutes;
