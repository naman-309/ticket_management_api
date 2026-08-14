import pool from "../../db/db.js";


// Add new comment
export const addCommentModel = async (
    ticketid,
    userid,
    message
) => {

    const { rows } = await pool.query(
        `INSERT INTO comments
     (ticketid, userid, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [ticketid, userid, message]
    );

    return rows[0];
};


// Get all comments of one ticket
export const getCommentsModel = async (ticketid) => {

    const { rows } = await pool.query(
        `SELECT * FROM comments
     WHERE ticketid = $1
     ORDER BY createdat ASC`,
        [ticketid]
    );

    return rows;
};


// Find one comment by comment id
export const getCommentByIdModel = async (id) => {

    const { rows } = await pool.query(
        `SELECT * FROM comments
     WHERE id = $1`,
        [id]
    );

    return rows[0];
};


// Delete one comment
export const deleteCommentModel = async (id) => {

    const { rows } = await pool.query(
        `DELETE FROM comments
     WHERE id = $1
     RETURNING *`,
        [id]
    );

    return rows[0];
};