/**
 * Account Model
 * Savings (min 1000) or Current (min 5000)
 * Links to User via userId reference
 */
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      required: [true, "Account type is required"],
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "frozen"],
      default: "active",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Generate unique account number (format: KB + random 8 digits)
accountSchema.statics.generateAccountNumber = function () {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `KB${randomNum}`;
};

module.exports = mongoose.model("Account", accountSchema);
