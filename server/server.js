import express from "express";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import authRouter from "./routes/authRoutes.js";
import webhookRouter from "./routes/webhookRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import globalErrorHandler from "./middleware/errorMiddleware.js";
import AppError from "./utils/AppError.js";

import "./configs/passport.js";

const app = express();

// ✅ VERY IMPORTANT (Render fix)
app.set("trust proxy", true);

// ✅ Allowed origins
const allowedOrigins = [
  "https://rental-car-wheat-nu.vercel.app",
  "http://localhost:5173",
  "https://rental-car-git-main-gargi-richhariyas-projects.vercel.app",
  "https://rental-fptols4yn-gargi-richhariyas-projects.vercel.app"
];

// ✅ CORS CONFIG
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked:", cleanOrigin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

// 🔥 MIDDLEWARES
app.use(helmet());
app.use(cors(corsOptions));


// ✅ RATE LIMIT (SAFE)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", limiter);
app.use("/auth", limiter);

// Webhook before body parser
app.use("/api/webhooks", webhookRouter);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Sanitize
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  next();
});

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.get("/", (req, res) => res.send("Server running"));

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/auth", authRouter);

// 404
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// Error handler
app.use(globalErrorHandler);

// ✅ START SERVER PROPERLY (NO CRASH)
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};

startServer();

// ✅ DEBUG (IMPORTANT)
process.on("SIGTERM", () => {
  console.log("💀 SIGTERM received");
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});

export default app;
