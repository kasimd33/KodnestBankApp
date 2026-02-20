/**
 * Transaction Controller
 * Get transaction history for customer's account
 */
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

/**
 * @route   GET /api/transactions/:accountId
 */
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
    });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    const transactions = await Transaction.find({ accountId })
      .sort({ createdAt: -1 })
      .limit(100);

    // Calculate totals for dashboard (accountId is our account)
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    const accIdStr = account._id.toString();
    transactions.forEach((t) => {
      if (t.type === "deposit") totalDeposits += t.amount;
      else if (t.type === "withdraw") totalWithdrawals += t.amount;
      else if (t.type === "transfer") {
        if (t.fromAccount?.toString() === accIdStr) totalWithdrawals += t.amount;
        else totalDeposits += t.amount;
      }
    });

    res.json({
      success: true,
      transactions,
      accountBalance: account.balance,
      totalDeposits,
      totalWithdrawals,
    });
  } catch (error) {
    next(error);
  }
};
