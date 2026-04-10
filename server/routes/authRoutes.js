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

//  Start Google Login
router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

//  Callback
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/?error=auth_failed`,
    session: false // We use JWTs, not sessions for the app itself, but passport might need it for OAuth
  }),
  (req, res) => {
    // 1) Generate Tokens
    const accessToken = generateAccessToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);

    // 2) Set Tokens in Cookies
    res.cookie('accessToken', accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    // 3) Redirect to frontend with accessToken (or frontend can fetch it via a separate endpoint)
    // For production, it's safer to redirect to a page that fetches the token or pass it securely.
    // Here we'll redirect to a dashboard with the token as a query param (common for simple logic)
    // or better, a specialized callback page.
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/auth-success?token=${accessToken}`);
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
