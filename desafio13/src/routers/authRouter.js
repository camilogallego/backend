const router = require("express").Router();
const userModel = require("../dao/models/user.model");
const isLogged = require("../middleware/auth");
const { createHash, isValidPassword } = require("../utils/encrypt");
const passport = require("passport")


router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, email, password, rol } = req.body;
  const passwordHash = await createHash(password)
  const userExists = await userModel.findOne({ email });
  if (userExists)
    return res.status(409).json({ msg: "Email already registered" });
  await userModel.create({
    username,
    email,
    password: passwordHash,
    rol,
  });
  res.redirect("/api/login");
});

router.get("/login", (req, res) => {
  if (req.session?.user) return res.redirect("/api/products");
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userFound = await userModel.findOne({ email }).lean();
  const isValidPass = await isValidPassword(password, userFound.password);
  if (!userFound || !isValidPass)
    return res.status(404).json({ msg: "Datos incorrectos" });
  req.session.user = userFound;
  res.redirect("/api/products");
});

router.get("/recover", async (req, res) => {
  res.render("recover");
});

router.post("/update", async (req, res)=>{
  try {
    const {oldPassword, newPassword , email} = req.body
    const newPasswordHash = await createHash(newPassword)
    const user = await userModel.findOne({email})

    const isValidPass = await isValidPassword(oldPassword, user.password)
    if(!isValidPass){
      res.status(401).json({message: "datos incorrectos"})
    }

    const updateUser = await userModel.findByIdAndUpdate(user._id, {password: newPasswordHash})
    if(!updateUser){
      res.status(404).json({message: "contraseña no actualizada"})
    }
    return res.render("login")
  } catch (error) {
    console.log(error);
  }
})

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.status(200).redirect("/api/login");
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      res.redirect("/api/products");
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
