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

// Middleware - CORS (allow all origins for Vercel/Render)
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// Root health check (Render pings this)
app.get("/", (req, res) => res.json({ status: "OK", service: "KodnestBank API" }));

// API health check
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

// Start server after DB connects
async function start() {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
