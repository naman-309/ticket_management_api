// TICKET MODEL
import pool from "../../db/db.js";


// New ticket database me save karega
export const createTicketModel = async (title, description, priority, customerid) => {

    const { rows } = await pool.query(
        `INSERT INTO tickets
    (title, description, priority, status, customerid, agentid)
    VALUES ($1, $2, $3, 'open', $4, NULL) 
    RETURNING *`,
        [title, description, priority, customerid]
    );

    return rows[0];
};