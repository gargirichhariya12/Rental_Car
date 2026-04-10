import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { sendTokens } from "../utils/tokenUtils.js";

// Register user
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || password.length < 8) {
    return next(new AppError("Please provide all required fields correctly (password min 8 chars)", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists with this email", 400));
  }

  // Password hashing is handled in model if using pre-save middleware, 
  // but here it was manual in the old code. We'll stick to manual for consistency 
  // or add a pre-save hook. Let's stick to manual for now but use bcrypt.
  // Actually, I'll add bcrypt hash here as before.
  const user = await User.create({ name, email, password, role });

  sendTokens(res, user, 201);
});

// Login user
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  sendTokens(res, user, 200);
});

//get user data using Token(JWT)
export const getUserData = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user
    }
  });
});

