const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");

const jwtStrategy = new JwtStrategy(
    { secretOrKey: process.env.SECRET_KEY, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() },
    async (payload, done) => {
        console.log(payload);
        try {
            const user = await User.findOne({ where: { id: payload.id } });
            if (!user) done(null, false);
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
);

passport.use("jwt-user", jwtStrategy);
