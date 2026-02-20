/**
 * KodnestBank Backend - Main Server Entry Point
 * MVC Architecture: Models, Controllers, Routes
 * Express + MongoDB + JWT Authentication
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware - Allow frontend (Vercel, localhost)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // Parse JSON request body

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "KodnestBank API is running" });
});

// API Routes (will be added as we build)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/accounts", require("./routes/accountRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Global 404 handler - catches undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler - catches all errors from async handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
