const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Task 9: total quantity sold per product (SQL aggregate function)
router.get("/quantity-sold", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.ProductID, p.ProductName, COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
      FROM Products p
      LEFT JOIN Sales s ON s.ProductID = p.ProductID
      GROUP BY p.ProductID, p.ProductName
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 10: product with the highest stock quantity
router.get("/highest-stock", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1"
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 12: products that have never been sold
router.get("/never-sold", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*
      FROM Products p
      LEFT JOIN Sales s ON s.ProductID = p.ProductID
      WHERE s.SaleID IS NULL
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 13: all sales with product name, quantity sold, sale date via JOIN
router.get("/sales-detail", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.ProductName, s.QuantitySold, s.SaleDate
      FROM Sales s
      JOIN Products p ON p.ProductID = s.ProductID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 6: seed script endpoint — inserts FreshFoods, its 3 products, and the Milk sale
router.post("/seed", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [supplierResult] = await conn.query(
      "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
      ["FreshFoods", "01001234567"]
    );
    const supplierId = supplierResult.insertId;

    const products = [
      ["Milk", 15.00, 50],
      ["Bread", 10.00, 30],
      ["Eggs", 20.00, 40],
    ];
    const productIds = {};
    for (const [name, price, stock] of products) {
      const [r] = await conn.query(
        "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)",
        [name, price, stock, supplierId]
      );
      productIds[name] = r.insertId;
    }

    await conn.query(
      "INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)",
      [productIds["Milk"], 2, "2025-05-20"]
    );

    await conn.commit();
    res.status(201).json({ message: "Seed data inserted.", supplierId, productIds });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
