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

// Initialize Express App
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

const sanitizeHtml = (value) => {
  if (typeof value === "string") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeHtml);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeHtml(nestedValue)])
    );
  }

  return value;
};

const express5CompatibleSanitizers = (req, res, next) => {
  // Express 5 exposes req.query via a getter-only property, so older middleware
  // that reassigns req.query crashes. We sanitize the writable request fields here.
  if (req.body) {
    req.body = sanitizeHtml(mongoSanitize.sanitize(req.body));
  }

  if (req.params) {
    req.params = sanitizeHtml(mongoSanitize.sanitize(req.params));
  }

  next();
};

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Enable CORS early so preflight requests receive headers before other middleware.
app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", corsOptions.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
    return res.sendStatus(204);
  }

  next();
});

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  skip: (req) => req.method === "OPTIONS"
});
app.use('/api', limiter);
app.use('/auth', limiter);

// Webhook route MUST be before body-parser
app.use('/api/webhooks', webhookRouter);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL injection and XSS.
app.use(express5CompatibleSanitizers);

// Connect Database
await connectDB();

//  SESSION (REQUIRED FOR GOOGLE AUTH)
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false
}));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => res.send('server is running'));

app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewRouter);
app.use('/auth', authRouter);

// Handle unhandled routes.
// Express 5 no longer accepts a bare "*" matcher here.
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
