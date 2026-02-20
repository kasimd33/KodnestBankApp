/**
 * Transaction Model
 * Records deposit, withdraw, and transfer operations
 * fromAccount/toAccount can be null for deposit/withdraw (bank operations)
 */
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null, // Null for deposits (money from external source)
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null, // Null for withdrawals (money to external)
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0.01,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "transfer"],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    // Reference to account for easier querying (the account this txn affects)
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster transaction history queries
transactionSchema.index({ accountId: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
