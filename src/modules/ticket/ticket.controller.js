// TICKET CONTROLLER
import { createTicketModel, getTicketsModel, getTicketByIdModel, updateTicketModel, deleteTicketModel } from "./ticket.model.js";


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


// getTickets - Logged-in user ke allowed tickets return karega
export const getTickets = async (req, res, next) => {
    try {

        // authenticateUser middleware se mila
        const user = req.user;

        const tickets = await getTicketsModel(user);

        return res.status(200).json({
            message: "Tickets fetched successfully",
            tickets
        });

    } catch (error) {
        next(error);
    }
};


// getTicket - Logged-in user ke allowed ticket return kareg - a on the basis of ticket id
// Single ticket get karega
export const getTicket = async (req, res, next) => {
    try {

        // URL se ticket id milegi
        const id = req.params.id;

        // Logged-in user JWT middleware se mila
        const user = req.user;

        const ticket = await getTicketByIdModel(id);


        // Ticket DB me nahi mila
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        // Customer sirf apna ticket dekh sakta hai
        if (
            user.role === "Customer" &&
            ticket.customerid !== user.id
        ) {
            return res.status(403).json({
                message: "You cannot access this ticket"
            });
        }


        // Agent sirf assigned ticket dekh sakta hai
        if (
            user.role === "Agent" &&
            ticket.agentid !== user.id
        ) {
            return res.status(403).json({
                message: "This ticket is not assigned to you"
            });
        }


        // Admin ke liye koi extra check nahi
        // Admin koi bhi ticket dekh sakta hai

        return res.status(200).json({
            message: "Ticket fetched successfully",
            ticket
        });

    } catch (error) {
        next(error);
    }
};
// updateTicket  
// role base ticket update karega - a on the basis of ticket id

export const updateTicket = async (req, res, next) => {
    try {

        const id = req.params.id;

        const user = req.user;

        // Pehle existing ticket find karenge
        const ticket = await getTicketByIdModel(id);


        // Ticket exist hi nahi karti
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        // Customer sirf apni ticket update kar sakta hai
        if (
            user.role === "Customer" &&
            ticket.customerid !== user.id
        ) {
            return res.status(403).json({
                message: "You cannot update this ticket"
            });
        }


        // Agent sirf assigned ticket update kar sakta hai
        if (
            user.role === "Agent" &&
            ticket.agentid !== user.id
        ) {
            return res.status(403).json({
                message: "This ticket is not assigned to you"
            });
        }

        // Request body
        const {
            title,
            description,
            priority,
            status
        } = req.body;


        // Agar koi value body me nahi bheji,
        // to old value hi rehne denge

        const newTitle = title ?? ticket.title;

        const newDescription =
            description ?? ticket.description;

        const newPriority =
            priority ?? ticket.priority;

        const newStatus =
            status ?? ticket.status;


        // Priority validation
        const allowedPriority = [
            "low",
            "medium",
            "high",
            "urgent"
        ];

        if (!allowedPriority.includes(newPriority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }


        // Status validation
        const allowedStatus = [
            "open",
            "in_progress",
            "resolved",
            "closed"
        ];

        if (!allowedStatus.includes(newStatus)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }


        const updatedTicket = await updateTicketModel(
            id,
            newTitle,
            newDescription,
            newPriority,
            newStatus
        );


        return res.status(200).json({
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });

    } catch (error) {
        next(error);
    }
};
// deleteTicket

export const deleteTicket = async (req, res, next) => {
    try {

        const id = req.params.id;
        const user = req.user;

        // Pehle ticket find karenge
        const ticket = await getTicketByIdModel(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        // Customer sirf apni ticket delete kar sakta hai
        if (
            user.role === "Customer" &&
            ticket.customerid !== user.id
        ) {
            return res.status(403).json({
                message: "You cannot delete this ticket"
            });
        }


        // Agent sirf assigned ticket delete kar sakta hai
        if (
            user.role === "Agent" &&
            ticket.agentid !== user.id
        ) {
            return res.status(403).json({
                message: "This ticket is not assigned to you"
            });
        }


        const deletedTicket = await deleteTicketModel(id);

        return res.status(200).json({
            message: "Ticket deleted successfully",
            ticket: deletedTicket
        });

    } catch (error) {
        next(error);
    }
};
// assignTicket
