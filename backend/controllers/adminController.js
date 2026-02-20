/**
 * Admin Controller
 * View customers, accounts, freeze/unfreeze, analytics
 */
const User = require("../models/User");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

/**
 * @route   GET /api/admin/customers
 */
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/accounts
 */
exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, accounts });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/accounts/:id/freeze
 */
exports.freezeAccount = async (req, res, next) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status: "frozen" },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }
    res.json({ success: true, message: "Account frozen", account });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/accounts/:id/unfreeze
 */
exports.unfreezeAccount = async (req, res, next) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }
    res.json({ success: true, message: "Account unfrozen", account });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/transactions
 */
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate("accountId", "accountNumber accountType")
      .populate("fromAccount", "accountNumber")
      .populate("toAccount", "accountNumber")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics
 * Admin analytics dashboard: Total users, accounts, balance, transactions
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const [userCount, accountCount, totalBalance, transactionCount] =
      await Promise.all([
        User.countDocuments({ role: "customer" }),
        Account.countDocuments(),
        Account.aggregate([{ $group: { _id: null, total: { $sum: "$balance" } } }]),
        Transaction.countDocuments(),
      ]);

    res.json({
      success: true,
      analytics: {
        totalUsers: userCount,
        totalAccounts: accountCount,
        totalBalance: totalBalance[0]?.total || 0,
        totalTransactions: transactionCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
