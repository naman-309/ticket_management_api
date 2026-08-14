import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import config from "./config/config.js";
import authRoutes from "./modules/auth/auth.routes.js";

import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Support Ticket API is running"
  });
});

app.use("/api/auth", authRoutes);

// Later:
// app.use("/api/tickets", ticketRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
