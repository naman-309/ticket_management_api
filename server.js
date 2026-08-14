import "dotenv/config";
import app from "./src/app.js";
import pool from "./src/db/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("DATABASE CONNECTED!!!!");

    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON PORT ${PORT}`);
    });
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error.message);
    process.exit(1);
  }
};

startServer();
