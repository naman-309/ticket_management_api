// TICKET CONTROLLER
import { createTicketModel } from "./ticket.model.js";





// createTicket

// Customer new ticket create karega
export const createTicket = async (req, res, next) => {
    try {

        const { title, description, priority } = req.body;

        // authenticateUser middleware ne JWT verify karke
        // req.user me logged-in user ka data rakha hai
        const customerid = req.user.id;


        // Basic validation
        if (!title || !description || !priority) {
            return res.status(400).json({
                message: "Title, description and priority are required"
            });
        }


        // Priority sirf in 4 values me se honi chahiye
        const allowedPriority = [
            "low",
            "medium",
            "high",
            "urgent"
        ];

        if (!allowedPriority.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }


        // Database model call
        const ticket = await createTicketModel(
            title,
            description,
            priority,
            customerid
        );


        return res.status(201).json({
            message: "Ticket created successfully",
            ticket
        });

    } catch (error) {
        next(error);
    }
};


// getTickets
// getTicket
// updateTicket
// deleteTicket
// assignTicket
