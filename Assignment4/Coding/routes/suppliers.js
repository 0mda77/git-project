const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Create a supplier
router.post("/", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    if (!SupplierName) return res.status(400).json({ error: "SupplierName is required." });
    const [result] = await pool.query(
      "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
      [SupplierName, ContactNumber || null]
    );
    res.status(201).json({ SupplierID: result.insertId, SupplierName, ContactNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all suppliers
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Suppliers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update supplier information
router.put("/:id", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    const [result] = await pool.query(
      `UPDATE Suppliers SET
         SupplierName = COALESCE(?, SupplierName),
         ContactNumber = COALESCE(?, ContactNumber)
       WHERE SupplierID = ?`,
      [SupplierName, ContactNumber, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Supplier not found." });
    res.json({ message: "Supplier updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a supplier
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM Suppliers WHERE SupplierID = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Supplier not found." });
    res.json({ message: "Supplier deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 5: Change ContactNumber to VARCHAR(15)
router.post("/schema/contactnumber-varchar15", async (req, res) => {
  try {
    await pool.query("ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)");
    res.json({ message: "ContactNumber changed to VARCHAR(15)." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 11 (reporting): suppliers whose names start with 'F'
router.get("/reports/starts-with-f", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
