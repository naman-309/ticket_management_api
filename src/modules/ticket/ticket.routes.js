// TICKET ROUTES
import express from "express";

import { createTicket, getTickets, getTicket, updateTicket, deleteTicket } from "./ticket.controller.js";
import { authenticateUser } from "../../middleware/auth.verify.middleware.js";
const router = express.Router();



// Create new ticket route
router.post("/create", authenticateUser, createTicket);

// Get tickets route on the  basic  of  role of logged-in user
router.get("/", authenticateUser, getTickets);

// get  ticket by id route

router.get("/byid/:id", authenticateUser, getTicket);

// update ticket by id route
router.put("/updatebyid/:id", authenticateUser, updateTicket);


// delete ticket by id route
router.delete("/deletebyid/:id", authenticateUser, deleteTicket);
export default router;

