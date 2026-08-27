const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
require("dotenv").config();

// Very simple protection: caller must send x-admin-key matching env var.
// In a real system this would be a proper auth/role check.
function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden: admin key required." });
  }
  next();
}

// Task 14: create MySQL user store_manager, grant SELECT, INSERT, UPDATE on all tables
router.post("/create-store-manager", requireAdmin, async (req, res) => {
  try {
    const password = process.env.STORE_MANAGER_PASSWORD || "ChangeMe123!";
    const dbName = process.env.DB_NAME || "retail_store";

    await pool.query(`CREATE USER IF NOT EXISTS 'store_manager'@'%' IDENTIFIED BY ?`, [password]);
    await pool.query(`GRANT SELECT, INSERT, UPDATE ON \`${dbName}\`.* TO 'store_manager'@'%'`);
    await pool.query("FLUSH PRIVILEGES");

    res.json({ message: "store_manager created with SELECT, INSERT, UPDATE on all tables." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 15: revoke UPDATE from store_manager
router.post("/revoke-update", requireAdmin, async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || "retail_store";
    await pool.query(`REVOKE UPDATE ON \`${dbName}\`.* FROM 'store_manager'@'%'`);
    await pool.query("FLUSH PRIVILEGES");
    res.json({ message: "UPDATE permission revoked from store_manager." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 16: grant DELETE to store_manager only on the Sales table
router.post("/grant-delete-sales", requireAdmin, async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || "retail_store";
    await pool.query(`GRANT DELETE ON \`${dbName}\`.Sales TO 'store_manager'@'%'`);
    await pool.query("FLUSH PRIVILEGES");
    res.json({ message: "DELETE permission granted to store_manager on Sales table only." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
