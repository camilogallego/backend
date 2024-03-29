import passport from "passport";
import { Strategy } from "passport-local";
import { CartService, UserService } from "../services/index.js";
import { UserDTO } from "../dto/index.js";
import { isValidPassword, createHash } from "../utils.js";
import GithubStrategy from "passport-github2";
import { API_VERSION } from "../config/config.js";
const localStrategy = Strategy;
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, PORT, HOST } from "../config/config.js";
import { Logger, ROLES } from "../helpers/index.js";

const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `http://${HOST}:${PORT}/api/${API_VERSION}/session/github/callback`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserService.getUser(profile.emails[0].value);
          if (!user) {
            const newCart = await CartService.addCart();
            if (!newCart) {
              Logger.error("Cant create a new cart");
              return done(null, false);
            }
            const userDTO = new UserDTO({
              email: profile.emails[0].value,
              password: "",
              first_name: profile._json.name,
              last_name: "",
              age: 0,
              address: "",
              cart: newCart._id,
              role: "user",
            });
            let newUser = await UserService.addUser(userDTO);
            done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserService.getUser(username);
          if (!user) {
            Logger.error("user doesn't exist");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            Logger.error("invalid password");
            return done(null, false);
          }
          const updatedUser = await UserService.updateLastLogIn(user._id);
          if (!updatedUser) {
            Logger.error("Failed to update last login time");
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, pw, done) => {
        const {
          first_name,
          last_name,
          email,
          age,
          password,
          address,
          role = ROLES.USER,
        } = req.body;
        try {
          let user = await UserService.getUser(username);
          if (user) {
            Logger.error("User already exists");
            return done(null, false);
          }
          const newCart = await CartService.createCart();
          if (!newCart) {
            Logger.error("Cant create a new cart");
            return done(null, false);
          }
          if (
            !first_name ||
            !last_name ||
            !email ||
            !age ||
            !password ||
            !address
          ) {
            Logger.error("You must send all fields to register");
            return done(null, false);
          }
          const userDTO = new UserDTO({
            email,
            password,
            first_name,
            last_name,
            age,
            address,
            cart: newCart._id,
            role,
          });
          const newUser = await UserService.addUser(userDTO);
          if (!newUser) {
            Logger.error("Cant create a new cart");
            return done(null, false);
          }
          return done(null, newUser);
        } catch (error) {
          return done("error al crear el nuevo ususario" + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserService.getUserById(id);
    done(null, user);
  });
};

export { initializePassport };
