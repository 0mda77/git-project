const mysql = require("mysql2/promise");
require("dotenv").config();

const {
  DB_HOST = "localhost",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "retail_store",
  DB_PORT = 3306,
} = process.env;

// Step 1: a connection (no DB selected yet) so we can CREATE DATABASE IF NOT EXISTS
async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.end();
}

// Step 2: the pool used by the whole app, scoped to the database
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Step 3: create Products, Suppliers, Sales tables with PK/FK relationships
async function initTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT AUTO_INCREMENT PRIMARY KEY,
      SupplierName VARCHAR(150) NOT NULL,
      ContactNumber VARCHAR(30)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Products (
      ProductID INT AUTO_INCREMENT PRIMARY KEY,
      ProductName TEXT NOT NULL,
      Price DECIMAL(10,2) NOT NULL,
      StockQuantity INT NOT NULL DEFAULT 0,
      SupplierID INT,
      FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
        ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT AUTO_INCREMENT PRIMARY KEY,
      ProductID INT NOT NULL,
      QuantitySold INT NOT NULL,
      SaleDate DATE NOT NULL,
      FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
}

async function initDatabase() {
  await ensureDatabaseExists();
  await initTables();
  console.log(`Database "${DB_NAME}" ready, tables ensured.`);
}

module.exports = { pool, initDatabase };
