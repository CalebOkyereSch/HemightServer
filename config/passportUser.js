const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Admi = mongoose.model("admi");
const keys = require("./keys");

const opt = {};

opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opt, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            Admi.findById(jwt_payload.id).then((admin) => {
              if (admin) {
                return done(null, admin);
              }
              return done(null, false);
            });
          }
        })
        .catch((err) => console.log(err));
    })
  );
};
