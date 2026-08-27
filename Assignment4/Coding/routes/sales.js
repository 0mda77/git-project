const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Record a sale
router.post("/", async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;
    if (!ProductID || !QuantitySold || !SaleDate) {
      return res.status(400).json({ error: "ProductID, QuantitySold and SaleDate are required." });
    }
    const [result] = await pool.query(
      "INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)",
      [ProductID, QuantitySold, SaleDate]
    );
    res.status(201).json({ SaleID: result.insertId, ProductID, QuantitySold, SaleDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all sales
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Sales");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve sales for a specific product
router.get("/product/:productId", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Sales WHERE ProductID = ?", [req.params.productId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
