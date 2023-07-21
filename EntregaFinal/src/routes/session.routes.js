import { Router } from "express";
import passport from "passport";
import { API_VERSION } from '../config/config.js';
import authMdw from "../middleware/auth.middleware.js";
import SessionController from '../controllers/session.controller.js';
import handlePolicies from "../middleware/handlePolicies.middleware.js";
import { policies } from '../middleware/constants.js';
class SessionRoutes {
  path = `/api/${API_VERSION}/session`;
  router = Router();
  controller = new SessionController();

  constructor() {
      this.initSessionRoutes();
  }

  initSessionRoutes() {
    this.router.get(`${this.path}/logout`, authMdw, handlePolicies([policies.ADMIN, policies.USER, policies.PREMIUM]), this.controller.logout);
    this.router.get(`${this.path}/faillogin`, handlePolicies([policies.PUBLIC]), this.controller.faillogin)
    this.router.get(`${this.path}/current`, authMdw, handlePolicies([policies.ADMIN, policies.PREMIUM, policies.USER]), this.controller.current)
    this.router.post(`${this.path}/register`,passport.authenticate('register', {failureRedirect: '/failRegister'}), this.controller.register);
    this.router.get(`${this.path}/failRegister`, handlePolicies([policies.PUBLIC]), this.controller.failRegister);
    this.router.get(`${this.path}/github`,passport.authenticate("github", { scope: ["user:email"] }), handlePolicies([policies.PUBLIC]), async (req, res) => {});
    this.router.post(`${this.path}/login`,passport.authenticate('login',{failureRedirect:'faillogin'}), handlePolicies([policies.PUBLIC]), this.controller.login);
    this.router.get(`${this.path}/github/callback`,passport.authenticate("github", { failureRedirect: "/login" }), handlePolicies([policies.PUBLIC]),this.controller.githubCallback);
    this.router.post(`${this.path}/restorePasswordRequest`, handlePolicies([policies.PUBLIC]), this.controller.createRestorePasswordRequest);
    this.router.post(`${this.path}/restorePassword/:userId`, handlePolicies([policies.PUBLIC]), this.controller.restorePassword);
  }
}

export default SessionRoutes;
