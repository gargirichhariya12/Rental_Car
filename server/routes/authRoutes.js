import express from "express";
import passport from "passport";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";

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
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=auth_failed`,
    session: false // We use JWTs, not sessions for the app itself, but passport might need it for OAuth
  }),
  (req, res) => {
    // 1) Generate Tokens
    const accessToken = generateAccessToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);

    // 2) Set Refresh Token in Cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    // 3) Redirect to frontend with accessToken (or frontend can fetch it via a separate endpoint)
    // For production, it's safer to redirect to a page that fetches the token or pass it securely.
    // Here we'll redirect to a dashboard with the token as a query param (common for simple logic)
    // or better, a specialized callback page.
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/auth-success?token=${accessToken}`);
  }
);

//  Logout
router.get("/logout", (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ status: 'success' });
});

//  Refresh Token Route
router.get("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  // Add logic to verify and issue new access token
});

export default router;