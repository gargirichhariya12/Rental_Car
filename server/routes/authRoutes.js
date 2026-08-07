import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
  getAccessCookieOptions,
  getRefreshCookieOptions,
} from "../utils/tokenUtils.js";
import User from "../models/User.js";

const router = express.Router();

const isGoogleOAuthConfigured = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

  return Boolean(
    GOOGLE_CLIENT_ID &&
    GOOGLE_CLIENT_SECRET &&
    !GOOGLE_CLIENT_ID.includes("your_google_client_id_here") &&
    !GOOGLE_CLIENT_SECRET.includes("your_google_client_secret_here")
  );
};

//  Start Google Login
router.get("/google", (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?error=google_oauth_not_configured`);
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })(req, res, next);
});

//  Callback
router.get("/google/callback",
  (req, res, next) => {
    if (!isGoogleOAuthConfigured()) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?error=google_oauth_not_configured`);
    }

    return next();
  },
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/?error=auth_failed`,
    session: false // We use JWTs, not sessions for the app itself, but passport might need it for OAuth
  }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);

    res.cookie('accessToken', accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:5173"}/auth-success?token=${encodeURIComponent(accessToken)}`
    );
  }
);

//  Logout
router.get("/logout", (req, res) => {
  res.clearCookie('accessToken', getAccessCookieOptions());
  res.clearCookie('refreshToken', getRefreshCookieOptions());
  res.status(200).json({ status: 'success' });
});

//  Refresh Token Route
const refreshTokenHandler = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User no longer exists' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('accessToken', accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    return res.status(200).json({
      status: 'success',
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
  }
};

router.get("/refresh", refreshTokenHandler);
router.post("/refresh", refreshTokenHandler);

export default router;
