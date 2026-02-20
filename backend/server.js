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
let dbReady = false;

// Middleware - CORS
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// Health checks (no DB - Render pings these)
app.get("/", (req, res) => res.json({ status: "OK", service: "KodnestBank API", db: dbReady }));
app.get("/api/health", (req, res) => res.json({ status: "OK", db: dbReady }));
app.get("/api/test", (req, res) => res.json({ ok: true, message: "API routing works" }));

// Block /api until DB ready (except routes above)
app.use("/api", (req, res, next) => {
  if (!dbReady) return res.status(503).json({ success: false, message: "Service starting, retry in 15 seconds" });
  next();
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/accounts", require("./routes/accountRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Global 404 - log for debugging
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "Route not found", path: req.originalUrl, method: req.method });
});

// Global Error Handler - catches all errors from async handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server immediately (Render needs fast boot)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// Connect DB in background
connectDB()
  .then(() => { dbReady = true; console.log("MongoDB connected - ready"); })
  .catch((err) => {
    console.error("MongoDB failed:", err.message);
    process.exit(1);
  });
