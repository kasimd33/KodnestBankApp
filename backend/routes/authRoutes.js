/**
 * Authentication Routes
 * Register (Customer only), Login (Admin & Customer)
 */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
// Helpful response if user opens in browser (GET)
router.get("/register", (req, res) => res.status(405).json({ message: "Use POST to register" }));
router.get("/login", (req, res) => res.status(405).json({ message: "Use POST to login" }));
router.get("/me", protect, authController.getMe);
router.put("/profile", protect, authController.updateProfile);

module.exports = router;
