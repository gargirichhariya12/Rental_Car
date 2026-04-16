// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
//  const protect = async (req, res, next )=>{
//     const token = req.headers.authorization;
//     if(!token) return res.json({success:false,message:"not authorized"})

//         try {
//             const userId = jwt.decode(token, process.env.JWT_SECRET)
//             if(!userId)return res.json({success:false,message:"not authorized"})
//             req.user = await User.findById(userId).select("-password")
//             next()

//         } catch (error) {
//             return res.json({success:false,message:"not authorized"})
//         }
// }
// export default protect

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Example: roles ['owner']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
