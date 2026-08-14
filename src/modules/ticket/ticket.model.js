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


// Role ke hisaab se tickets nikalne ke liye
export const getTicketsModel = async (user) => {

    // Admin -> sab tickets
    if (user.role === "Admin") {
        const { rows } = await pool.query(
            "SELECT * FROM tickets ORDER BY createdat DESC"
        );

        return rows;
    }


    // Agent -> sirf assigned tickets
    if (user.role === "Agent") {
        const { rows } = await pool.query(
            `SELECT * FROM tickets
       WHERE agentid = $1
       ORDER BY createdat DESC`,
            [user.id]
        );

        return rows;
    }


    // Customer -> sirf apne tickets
    const { rows } = await pool.query(
        `SELECT * FROM tickets
     WHERE customerid = $1
     ORDER BY createdat DESC`,
        [user.id]
    );

    return rows;
};


// Single ticket ID se find karega
export const getTicketByIdModel = async (id) => {

    const { rows } = await pool.query(
        `SELECT * FROM tickets
     WHERE id = $1`,
        [id]
    );

    return rows[0];
};


// Ticket update database me karega
export const updateTicketModel = async (
    id,
    title,
    description,
    priority,
    status
) => {

    const { rows } = await pool.query(
        `UPDATE tickets
     SET title = $1,
         description = $2,
         priority = $3,
         status = $4,
         updatedat = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
        [
            title,
            description,
            priority,
            status,
            id
        ]
    );

    return rows[0];
};

// Ticket delete karega
export const deleteTicketModel = async (id) => {

    const { rows } = await pool.query(
        `DELETE FROM tickets
     WHERE id = $1
     RETURNING *`,
        [id]
    );

    return rows[0];
};