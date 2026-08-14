import express from "express";

import { register, login, logout } from "./auth.controller.js";

import { authenticateUser } from "../../middleware/auth.verify.middleware.js";
import { authLimiter } from "../../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", authenticateUser, logout);

export default router;
