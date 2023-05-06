import Router from "express";
import handlePolicies from "../middleware/handlePoliciesMiddleware.js";
import userModel from "../dao/mongo/models/index.js";
import createHashValue from "../utils/encrypt.js";
import isValidPassword from "../utils/encrypt.js";
import generateJWT from "../utils/jwt.js";

const router = Router();

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err)
      return res.status(500).json({ message: `error internal, logout` });
    return res.send({ message: `logout Error`, body: err });
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await userModel.findOne({ email }).lean();
    const isValidPass = await isValidPassword(password, userFound.password);
    if (!userFound || !isValidPass){
        return res.status(404).json({ msg: "Datos incorrectos" });
    }

    const signUser = {
      email,
      role: findUser.role,
      id: findUser._id,
    };

    const token = await generateJWT({ ...signUser });

    req.session.user = {
      ...signUser,
    };

    return res.json({ message: `welcome $${email},login success`, token });
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    const pswHashed = await createHashValue(password);

    const userAdd = {
      email,
      password,
      username,
      password: pswHashed,
      rol,
    };
    const newUser = await userModel.create(userAdd);

    req.session.user = { email, rol, id: newUser._id };

    return res.json({
      message: `usuario creado`,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: `${error}` });
  }
});

router.get("/current", handlePolicies(["PUBLIC"]), async (req, res) => {
  const usersDTO = req.user.map((user) => usersDTO.toDTO(user));
  return res.json(usersDTO);
});

router.get("/current/admin", handlePolicies(["ADMIN"]), async (req, res) => {
  return res.json({ message: `jwt en las los headers siendo ADMIN` });
});

router.get(
  "/current/user",
  handlePolicies(["USER", "ADMIN"]),
  async (req, res) => {
    return res.json({ message: `jwt en las los headers` });
  }
);

export default router;
