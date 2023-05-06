import jwt from "jsonwebtoken";
import {SESSION_SECRET }from "../config/config.js"

const SECRET_JWT = SESSION_SECRET

const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, SECRET_JWT, { expiresIn: "30m" }, (err, token) => {
      if (err) {
        console.log(err);
        reject("can not generate jwt token");
      }
      resolve(token);
    });
  });
};

export default {
  generateJWT,
  SECRET_JWT,
};
