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

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    }

    //Extract token
    const token = authHeader.split(" ")[1];

    // VERIFY token (not decode)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "not authorized",
    });
  }
};

export default protect;
