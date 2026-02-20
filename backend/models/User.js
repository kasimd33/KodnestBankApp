/**
 * User Model
 * Stores customer and admin account information
 * Password is hashed using bcrypt before saving
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    mobile: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Hash password before saving to database (pre-save middleware)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
