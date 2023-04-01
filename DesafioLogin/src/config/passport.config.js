const { GITHUB_CLIENT, GITHUB_SECRET } = process.env;
const passport = require("passport")
const GithubStrategy = require("passport-github2")
const userModel = require("../dao/models/user.model");

const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT,
        clientSecret: GITHUB_SECRET,
        callbackURL: "http://localhost:8080/api/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json?.email });
          if (!user) {
            let addNewUser = {
              username: profile._json.name,
              email: profile._json?.email ? profile._json?.email : profile.username,
              age: 0,
              password: "123",
            };

            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
          } else {
            //ya existe el usuario
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });
};

module.exports = initializePassport;