-- Assignment 4 - Part 3
-- Standalone SQL script: creates the database/tables and inserts the required seed data.
-- (The Node.js API does the same thing programmatically; this file is provided as a
--  reference / manual-run alternative.)

CREATE DATABASE IF NOT EXISTS retail_store;
USE retail_store;

CREATE TABLE IF NOT EXISTS Suppliers (
  SupplierID INT AUTO_INCREMENT PRIMARY KEY,
  SupplierName VARCHAR(150) NOT NULL,
  ContactNumber VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS Products (
  ProductID INT AUTO_INCREMENT PRIMARY KEY,
  ProductName TEXT NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  StockQuantity INT NOT NULL DEFAULT 0,
  SupplierID INT,
  FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Sales (
  SaleID INT AUTO_INCREMENT PRIMARY KEY,
  ProductID INT NOT NULL,
  QuantitySold INT NOT NULL,
  SaleDate DATE NOT NULL,
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Task 6: seed data
INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES ('FreshFoods', '01001234567');
SET @supplierId = LAST_INSERT_ID();

INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES
  ('Milk', 15.00, 50, @supplierId),
  ('Bread', 10.00, 30, @supplierId),
  ('Eggs', 20.00, 40, @supplierId);

INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
SELECT ProductID, 2, '2025-05-20' FROM Products WHERE ProductName = 'Milk' LIMIT 1;

-- Task 7: update price of Bread
UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread';

-- Task 8: delete Eggs
DELETE FROM Products WHERE ProductName = 'Eggs';
