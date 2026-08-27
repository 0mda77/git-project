const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// ----- CRUD: Products -----

// Create a product
router.post("/", async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    if (!ProductName || Price === undefined) {
      return res.status(400).json({ error: "ProductName and Price are required." });
    }
    const [result] = await pool.query(
      "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)",
      [ProductName, Price, StockQuantity || 0, SupplierID || null]
    );
    res.status(201).json({ ProductID: result.insertId, ProductName, Price, StockQuantity, SupplierID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve a product by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Products WHERE ProductID = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Product not found." });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const [result] = await pool.query(
      `UPDATE Products SET
         ProductName = COALESCE(?, ProductName),
         Price = COALESCE(?, Price),
         StockQuantity = COALESCE(?, StockQuantity),
         SupplierID = COALESCE(?, SupplierID)
       WHERE ProductID = ?`,
      [ProductName, Price, StockQuantity, SupplierID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found." });
    res.json({ message: "Product updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM Products WHERE ProductID = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- Task 5: schema modification endpoints -----

// Add Category column
router.post("/schema/add-category", async (req, res) => {
  try {
    await pool.query("ALTER TABLE Products ADD COLUMN Category VARCHAR(100)");
    res.json({ message: "Category column added." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove Category column
router.delete("/schema/remove-category", async (req, res) => {
  try {
    await pool.query("ALTER TABLE Products DROP COLUMN Category");
    res.json({ message: "Category column removed." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add NOT NULL constraint to ProductName
router.post("/schema/productname-not-null", async (req, res) => {
  try {
    await pool.query("ALTER TABLE Products MODIFY ProductName TEXT NOT NULL");
    res.json({ message: "ProductName is now NOT NULL." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- Task 7: update price of Bread to 25.00 -----
router.put("/by-name/bread-price", async (req, res) => {
  try {
    await pool.query("UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'");
    res.json({ message: "Bread price updated to 25.00." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- Task 8: delete product Eggs -----
router.delete("/by-name/eggs", async (req, res) => {
  try {
    await pool.query("DELETE FROM Products WHERE ProductName = 'Eggs'");
    res.json({ message: "Eggs deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
