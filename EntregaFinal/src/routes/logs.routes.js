import { Router } from "express";
import handlePolicies from "../middleware/handlePolicies.middleware.js";
import { policies } from '../middleware/constants.js';
import LogsController from '../controllers/logs.controller.js';
import { API_VERSION } from '../config/config.js';

class LogsRoutes {
    path = `/api/${API_VERSION}/loggerTest`;
    router = Router();
    controller = new LogsController();

    constructor() {
        this.initLogsRoutes();
    }

    initLogsRoutes() {
        this.router.get(this.path, handlePolicies([policies.PUBLIC]), this.controller.createLogs);
    }
}

export default LogsRoutes;
