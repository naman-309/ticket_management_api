// TICKET ROUTES
import express from "express";

import { createTicket } from "./ticket.controller.js";
import { authenticateUser } from "../../middleware/auth.verify.middleware.js";
const router = express.Router();



// Create new ticket route
router.post("/create", authenticateUser, createTicket);




export default router;