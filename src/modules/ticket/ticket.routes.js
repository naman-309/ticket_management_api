// TICKET ROUTES
import express from "express";

import { createTicket, getTickets, getTicket, updateTicket } from "./ticket.controller.js";
import { authenticateUser } from "../../middleware/auth.verify.middleware.js";
const router = express.Router();



// Create new ticket route
router.post("/create", authenticateUser, createTicket);

// Get tickets route on the  basic  of  role of logged-in user
router.get("/", authenticateUser, getTickets);

// get  ticket by id route

router.get("/byid/:id", authenticateUser, getTicket);

router.put("/updatebyid/:id", authenticateUser, updateTicket);

export default router;