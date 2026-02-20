/**
 * Account Routes
 * Create account, view details, deposit, withdraw, transfer
 */
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { protect, customerOnly } = require("../middleware/auth");

router.use(protect);
router.use(customerOnly);

router.post("/create", accountController.createAccount);
router.get("/my-accounts", accountController.getMyAccounts);
router.get("/:id", accountController.getAccountDetails);
router.post("/deposit", accountController.deposit);
router.post("/withdraw", accountController.withdraw);
router.post("/transfer", accountController.transfer);

module.exports = router;
