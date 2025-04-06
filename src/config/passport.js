import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../models/user.model.js";

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
    secretOrKey: 'secretCoder'
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

export default passport;
