import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const backendBaseUrl = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/+$/, "");
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL || `${backendBaseUrl}/auth/google/callback`;

const hasConfiguredGoogleOAuth = Boolean(
  googleClientId &&
  googleClientSecret &&
  !googleClientId.includes("your_google_client_id_here") &&
  !googleClientSecret.includes("your_google_client_secret_here")
);

if (hasConfiguredGoogleOAuth) {
  passport.use(new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const primaryEmail = profile.emails?.[0]?.value?.toLowerCase().trim();

        if (!primaryEmail) {
          return done(new Error("Google account did not return an email address"), null);
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: primaryEmail }]
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: primaryEmail,
            googleId: profile.id,
            image: profile.photos?.[0]?.value || "",
            isVerified: true
          });
        } else {
          let shouldSave = false;

          if (!user.googleId) {
            user.googleId = profile.id;
            shouldSave = true;
          }

          if (!user.image && profile.photos?.[0]?.value) {
            user.image = profile.photos[0].value;
            shouldSave = true;
          }

          if (!user.isVerified) {
            user.isVerified = true;
            shouldSave = true;
          }

          if (shouldSave) {
            await user.save();
          }
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  ));
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
