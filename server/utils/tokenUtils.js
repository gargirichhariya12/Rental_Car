import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', {
    expiresIn: '7d',
  });
};

// 🔑 In production (Vercel ↔ Railway are different domains),
// sameSite must be 'none' + secure:true for cookies to be sent cross-origin.
const isProduction = process.env.NODE_ENV === 'production';

export const getAccessCookieOptions = () => ({
  expires: new Date(Date.now() + 15 * 60 * 1000),
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
});

export const getRefreshCookieOptions = () => ({
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
});

export const sendTokens = (res, user, statusCode) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('accessToken', accessToken, getAccessCookieOptions());
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user,
    },
  });
};
