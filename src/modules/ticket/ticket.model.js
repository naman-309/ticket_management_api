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
export const getTicketsModel = async (
    user,
    status,
    priority,
    limit,
    offset
) => {

    // ---------------- ADMIN ----------------

    if (user.role === "Admin") {

        // status + priority
        if (status && priority) {
            const { rows } = await pool.query(
                `SELECT * FROM tickets
         WHERE status = $1
         AND priority = $2
         ORDER BY createdat DESC
         LIMIT $3 OFFSET $4`,
                [
                    status,
                    priority,
                    limit,
                    offset
                ]
            );

            return rows;
        }


        // only status
        if (status) {
            const { rows } = await pool.query(
                `SELECT * FROM tickets
         WHERE status = $1
         ORDER BY createdat DESC
         LIMIT $2 OFFSET $3`,
                [
                    status,
                    limit,
                    offset
                ]
            );

            return rows;
        }


        // only priority
        if (priority) {
            const { rows } = await pool.query(
                `SELECT * FROM tickets
         WHERE priority = $1
         ORDER BY createdat DESC
         LIMIT $2 OFFSET $3`,
                [
                    priority,
                    limit,
                    offset
                ]
            );

            return rows;
        }


        // no filter
        const { rows } = await pool.query(
            `SELECT * FROM tickets
       ORDER BY createdat DESC
       LIMIT $1 OFFSET $2`,
            [
                limit,
                offset
            ]
        );

        return rows;
    }



    // ---------------- AGENT ----------------

    if (user.role === "Agent") {

        // assigned + status + priority
        if (status && priority) {
            const { rows } = await pool.query(
                `SELECT * FROM tickets
         WHERE agentid = $1
         AND status = $2
         AND priority = $3
         ORDER BY createdat DESC
         LIMIT $4 OFFSET $5`,
                [
                    user.id,
                    status,
                    priority,
                    limit,
                    offset
                ]
            );

            return rows;
        }


        // assigned + status
        if (status) {
            const { rows } = await pool.query(
                `SELECT * FROM tickets
         WHERE agentid = $1
         AND status = $2
         ORDER BY createdat DESC
         LIMIT $3 OFFSET $4`,
                [
                    user.id,
                    status,
                    limit,
                    offset
                ]
            );

            return rows;
        }


        // assigned + priority
        if (priority) {
            const { rows } = await pool.query(
                `SELECT * FROM tickets
         WHERE agentid = $1
         AND priority = $2
         ORDER BY createdat DESC
         LIMIT $3 OFFSET $4`,
                [
                    user.id,
                    priority,
                    limit,
                    offset
                ]
            );

            return rows;
        }


        // only assigned tickets
        const { rows } = await pool.query(
            `SELECT * FROM tickets
       WHERE agentid = $1
       ORDER BY createdat DESC
       LIMIT $2 OFFSET $3`,
            [
                user.id,
                limit,
                offset
            ]
        );

        return rows;
    }



    // ---------------- CUSTOMER ----------------

    // own tickets + status + priority
    if (status && priority) {
        const { rows } = await pool.query(
            `SELECT * FROM tickets
       WHERE customerid = $1
       AND status = $2
       AND priority = $3
       ORDER BY createdat DESC
       LIMIT $4 OFFSET $5`,
            [
                user.id,
                status,
                priority,
                limit,
                offset
            ]
        );

        return rows;
    }


    // own tickets + status
    if (status) {
        const { rows } = await pool.query(
            `SELECT * FROM tickets
       WHERE customerid = $1
       AND status = $2
       ORDER BY createdat DESC
       LIMIT $3 OFFSET $4`,
            [
                user.id,
                status,
                limit,
                offset
            ]
        );

        return rows;
    }


    // own tickets + priority
    if (priority) {
        const { rows } = await pool.query(
            `SELECT * FROM tickets
       WHERE customerid = $1
       AND priority = $2
       ORDER BY createdat DESC
       LIMIT $3 OFFSET $4`,
            [
                user.id,
                priority,
                limit,
                offset
            ]
        );

        return rows;
    }


    // only own tickets
    const { rows } = await pool.query(
        `SELECT * FROM tickets
     WHERE customerid = $1
     ORDER BY createdat DESC
     LIMIT $2 OFFSET $3`,
        [
            user.id,
            limit,
            offset
        ]
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

//
// User ko id se find karega
export const findUserByIdModel = async (id) => {

    const { rows } = await pool.query(
        `SELECT id, name, email, role
     FROM users
     WHERE id = $1`,
        [id]
    );

    return rows[0];
};


// Ticket ko agent assign karega
export const assignTicketModel = async (ticketid, agentid) => {

    const { rows } = await pool.query(
        `UPDATE tickets
     SET agentid = $1,
         updatedat = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
        [agentid, ticketid]
    );

    return rows[0];
};