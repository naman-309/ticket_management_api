import express from "express";

import {
    addComment,
    getComments,
    deleteComment
} from "./comment.controller.js";

import {
    authenticateUser
} from "../../middleware/auth.verify.middleware.js";


const router = express.Router();


// Add comment on ticket
router.post(
    "/tickets/:ticketid/comments",
    authenticateUser,
    addComment
);


// Get all comments of ticket
router.get(
    "/tickets/:ticketid/comments",
    authenticateUser,
    getComments
);


// Delete comment by comment id
router.delete(
    "/comments/:id",
    authenticateUser,
    deleteComment
);


export default router;