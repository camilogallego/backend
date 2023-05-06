import passport from "passport";
import ROLES from "./roles.js";
import jwt from "passport-jwt";
import SECRET_JWT from "../utils/jwt.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Bearer atokenaskjehbdkajdhkahdka
        secretOrKey: SECRET_JWT,
      },
      async (jwtPayload, done) => {
        console.log(jwtPayload);
        try {
          if (ROLES.includes(jwtPayload.role)) {
            return done(null, jwtPayload);
          }
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
