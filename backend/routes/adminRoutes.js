/**
 * Admin Routes
 * View customers, accounts, freeze/unfreeze, all transactions
 */
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);
router.use(adminOnly);

router.get("/customers", adminController.getAllCustomers);
router.get("/accounts", adminController.getAllAccounts);
router.put("/accounts/:id/freeze", adminController.freezeAccount);
router.put("/accounts/:id/unfreeze", adminController.unfreezeAccount);
router.get("/transactions", adminController.getAllTransactions);
router.get("/analytics", adminController.getAnalytics);

module.exports = router;
