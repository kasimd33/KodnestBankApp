/**
 * Seed Admin Script
 * Run: node scripts/seedAdmin.js
 * Creates default admin if not exists (admin@kodnestbank.com / admin123)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const exists = await User.findOne({ email: "admin@kodnestbank.com" });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
    return;
  }
  await User.create({
    name: "Admin",
    email: "admin@kodnestbank.com",
    password: "admin123",
    role: "admin",
  });
  console.log("Admin created: admin@kodnestbank.com / admin123");
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
