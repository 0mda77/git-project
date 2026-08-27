const express = require("express");
require("dotenv").config();
const { initDatabase } = require("./config/db");

const productsRouter = require("./routes/products");
const suppliersRouter = require("./routes/suppliers");
const salesRouter = require("./routes/sales");
const reportsRouter = require("./routes/reports");
const adminRouter = require("./routes/admin");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Retail Store API is running." });
});

app.use("/api/products", productsRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/sales", salesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/admin", adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err.message);
    process.exit(1);
  });

module.exports = app;
