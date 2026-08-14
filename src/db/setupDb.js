import pool from "./db.js";

const setupDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'Customer',
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (role IN ('Admin', 'Agent', 'Customer'))
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        priority VARCHAR(20) NOT NULL DEFAULT 'medium',
        status VARCHAR(30) NOT NULL DEFAULT 'open',
        customerid INT NOT NULL,
        agentid INT,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),

        FOREIGN KEY (customerid)
        REFERENCES users(id)
        ON DELETE CASCADE,

        FOREIGN KEY (agentid)
        REFERENCES users(id)
        ON DELETE SET NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        ticketid INT NOT NULL,
        userid INT NOT NULL,
        message TEXT NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (ticketid)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

        FOREIGN KEY (userid)
        REFERENCES users(id)
        ON DELETE CASCADE
      );
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS tickets_status_idx ON tickets(status);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS tickets_priority_idx ON tickets(priority);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS tickets_customer_idx ON tickets(customerid);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS tickets_agent_idx ON tickets(agentid);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS comments_ticket_idx ON comments(ticketid);`);

    console.log("DATABASE TABLES CREATED SUCCESSFULLY");
  } catch (error) {
    console.error("DATABASE SETUP ERROR:", error.message);
  } finally {
    await pool.end();
  }
};

setupDb();
