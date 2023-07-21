import { Router } from "express";
import { API_VERSION } from '../config/config.js';
import TicketController from '../controllers/ticket.controller.js';
import authMdw from "../middleware/auth.middleware.js";
import handlePolicies from "../middleware/handlePolicies.middleware.js";
import { policies } from '../middleware/constants.js';
class TicketRoutes {
  path = `/api/${API_VERSION}/ticket`;
  router = Router();
  controller = new TicketController()

  constructor() {
    this.initTicketRoutes();
  }

  initTicketRoutes() {
    this.router.get(`${this.path}`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.getTicket);
    this.router.post(`${this.path}`, authMdw, handlePolicies([policies.USER, policies.PREMIUM]), this.controller.createTicket);
    
  }
}

export default TicketRoutes;
