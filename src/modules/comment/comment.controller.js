import {
    addCommentModel,
    getCommentsModel,
    getCommentByIdModel,
    deleteCommentModel
} from "./comment.model.js";

import {
    getTicketByIdModel
} from "../ticket/ticket.model.js";


// ---------------- ADD COMMENT ----------------

export const addComment = async (req, res, next) => {
    try {

        const ticketid = req.params.ticketid;

        const user = req.user;

        const { message } = req.body;


        // Message required
        if (!message || message.trim() === "") {
            return res.status(400).json({
                message: "Comment message is required"
            });
        }


        // Check ticket exists
        const ticket = await getTicketByIdModel(ticketid);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        // Customer sirf apne ticket par comment kar sakta hai
        if (
            user.role === "Customer" &&
            ticket.customerid !== user.id
        ) {
            return res.status(403).json({
                message: "You cannot comment on this ticket"
            });
        }


        // Agent sirf assigned ticket par comment kar sakta hai
        if (
            user.role === "Agent" &&
            ticket.agentid !== user.id
        ) {
            return res.status(403).json({
                message: "This ticket is not assigned to you"
            });
        }


        // Admin ke liye extra restriction nahi

        const comment = await addCommentModel(
            ticketid,
            user.id,
            message.trim()
        );


        return res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        next(error);
    }
};



// ---------------- GET COMMENTS ----------------

export const getComments = async (req, res, next) => {
    try {

        const ticketid = req.params.ticketid;

        const user = req.user;


        // Check ticket exists
        const ticket = await getTicketByIdModel(ticketid);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        // Customer sirf apne ticket ke comments dekh sakta hai
        if (
            user.role === "Customer" &&
            ticket.customerid !== user.id
        ) {
            return res.status(403).json({
                message: "You cannot view comments of this ticket"
            });
        }


        // Agent sirf assigned ticket ke comments dekh sakta hai
        if (
            user.role === "Agent" &&
            ticket.agentid !== user.id
        ) {
            return res.status(403).json({
                message: "This ticket is not assigned to you"
            });
        }


        const comments = await getCommentsModel(ticketid);


        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        });

    } catch (error) {
        next(error);
    }
};



// ---------------- DELETE COMMENT ----------------

export const deleteComment = async (req, res, next) => {
    try {

        // Yaha id = comment id
        const id = req.params.id;

        const user = req.user;


        // Comment find karo
        const comment = await getCommentByIdModel(id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }


        // Admin koi bhi comment delete kar sakta hai
        // Customer/Agent sirf apna comment delete kar sakte hain
        if (
            user.role !== "Admin" &&
            comment.userid !== user.id
        ) {
            return res.status(403).json({
                message: "You cannot delete this comment"
            });
        }


        const deletedComment = await deleteCommentModel(id);


        return res.status(200).json({
            message: "Comment deleted successfully",
            comment: deletedComment
        });

    } catch (error) {
        next(error);
    }
};