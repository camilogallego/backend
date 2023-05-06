const path = require("path");
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(`${__dirname}/public/uploads/`));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({
  storage,
  onError: function (err, next) {
    console.log(err);
    next();
  },
});

const createHash =  password =>  hashSync(password, genSaltSync())

const isValidPassword = async (password, encryptPassword) =>  await compareSync(password, encryptPassword);

export default {uploader,createHash, isValidPassword}