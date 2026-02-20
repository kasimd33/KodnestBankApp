/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 * Used for protecting routes that require login
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};

/**
 * Role-based middleware - restrict access to admin only
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Admin access required" });
  }
};

/**
 * Customer only - restrict access to customer role
 */
const customerOnly = (req, res, next) => {
  if (req.user && req.user.role === "customer") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Customer access required" });
  }
};

module.exports = { protect, adminOnly, customerOnly };
