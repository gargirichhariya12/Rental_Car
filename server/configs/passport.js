import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js"; // adjust if needed

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || "http://localhost:3000"}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        googleId: profile.id
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});