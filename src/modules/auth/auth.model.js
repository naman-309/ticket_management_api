import pool from "../../db/db.js";

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return rows[0];
};

export const createUser = async (name, email, hashedPassword) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'Customer')
     RETURNING id, name, email, role, createdat`,
    [name, email, hashedPassword]
  );

  return rows[0];
};
