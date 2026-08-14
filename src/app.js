import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import config from "./config/config.js";
import authRoutes from "./modules/auth/auth.routes.js";
// using  rate limiting middleware
import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
// ticket routes
import ticketRoute from "./modules/ticket/ticket.routes.js";
// comments 

import commentRoutes from "./modules/comment/comment.routes.js";

const app = express();
// Apply security headers  - prevent  form attacks and other vulnerabilities
app.use(helmet());
// Enable CORS with credentials
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
// Log HTTP requests in development mode
app.use(morgan("dev"));

app.use(apiLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Support Ticket API is running"
  });
});

// authentication routes
app.use("/api/auth", authRoutes);

// ticket routes
import ticketRoutes from "./modules/ticket/ticket.routes.js";
app.use("/api/tickets", ticketRoute);


app.use("/api", commentRoutes);



app.use(errorHandler);

export default app;
