import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Short lived
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', {
    expiresIn: '7d', // Long lived
  });
};

export const getAccessCookieOptions = () => ({
  expires: new Date(Date.now() + 15 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

export const getRefreshCookieOptions = () => ({
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

export const sendTokens = (res, user, statusCode) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('accessToken', accessToken, getAccessCookieOptions());
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

  // Remove password from output
  user.password = undefined;
  user.refreshToken = refreshToken; // Optionally save to DB for rotation

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user,
    },
  });
};
