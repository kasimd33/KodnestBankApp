/**
 * Transaction Routes
 * View transaction history for customer's accounts
 */
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { protect, customerOnly } = require("../middleware/auth");

router.use(protect);
router.use(customerOnly);

router.get("/:accountId", transactionController.getTransactionHistory);

module.exports = router;
