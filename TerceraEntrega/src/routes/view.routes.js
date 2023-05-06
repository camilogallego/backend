import { Router } from "express";

const router = Router();

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/recover", async (req, res) => {
  res.render("recover");
});


export default router;
