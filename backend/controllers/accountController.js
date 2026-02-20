/**
 * Account Controller
 * Business rules: Savings min 1000, Current min 5000, no overdraft
 */
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const sendEmail = require("../utils/sendEmail");

const MIN_BALANCE = { Savings: 1000, Current: 5000 };

/**
 * @route   POST /api/accounts/create
 * @body    accountType (Savings/Current), initialDeposit
 */
exports.createAccount = async (req, res, next) => {
  try {
    const { accountType, initialDeposit = 0 } = req.body;
    const userId = req.user._id;

    if (!accountType || !["Savings", "Current"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Valid account type required (Savings or Current)",
      });
    }

    const minRequired = MIN_BALANCE[accountType];
    if (initialDeposit < minRequired) {
      return res.status(400).json({
        success: false,
        message: `${accountType} account requires minimum ₹${minRequired}`,
      });
    }

    const accountNumber = Account.generateAccountNumber();
    const account = await Account.create({
      accountNumber,
      accountType,
      balance: initialDeposit,
      userId,
    });

    if (initialDeposit > 0) {
      await Transaction.create({
        fromAccount: null,
        toAccount: account._id,
        amount: initialDeposit,
        type: "deposit",
        description: "Initial deposit",
        accountId: account._id,
      });
    }

    res.status(201).json({
      success: true,
      account: {
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        status: account.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/accounts/my-accounts
 */
exports.getMyAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({ userId: req.user._id });
    res.json({ success: true, accounts });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/accounts/:id
 */
exports.getAccountDetails = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }
    res.json({ success: true, account });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/accounts/deposit
 * @body    accountId, amount
 */
exports.deposit = async (req, res, next) => {
  try {
    const { accountId, amount } = req.body;

    if (!accountId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid accountId and amount required",
      });
    }

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
    });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }
    if (account.status !== "active") {
      return res.status(400).json({ success: false, message: "Account is frozen" });
    }

    account.balance += amount;
    await account.save();

    await Transaction.create({
      fromAccount: null,
      toAccount: account._id,
      amount,
      type: "deposit",
      accountId: account._id,
    });

    sendEmail(
      req.user.email,
      "Deposit Alert - KodnestBank",
      `₹${amount} has been deposited successfully. New balance: ₹${account.balance}`
    ).catch(() => {});

    res.json({
      success: true,
      message: "Deposit successful",
      newBalance: account.balance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/accounts/withdraw
 * @body    accountId, amount
 * No overdraft allowed
 */
exports.withdraw = async (req, res, next) => {
  try {
    const { accountId, amount } = req.body;

    if (!accountId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid accountId and amount required",
      });
    }

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
    });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }
    if (account.status !== "active") {
      return res.status(400).json({ success: false, message: "Account is frozen" });
    }

    const minRequired = MIN_BALANCE[account.accountType];
    if (account.balance - amount < minRequired) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Minimum ${account.accountType} balance: ₹${minRequired}`,
      });
    }

    account.balance -= amount;
    await account.save();

    await Transaction.create({
      fromAccount: account._id,
      toAccount: null,
      amount,
      type: "withdraw",
      accountId: account._id,
    });

    sendEmail(
      req.user.email,
      "Withdrawal Alert - KodnestBank",
      `₹${amount} has been withdrawn successfully. New balance: ₹${account.balance}`
    ).catch(() => {});

    res.json({
      success: true,
      message: "Withdrawal successful",
      newBalance: account.balance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/accounts/transfer
 * @body    fromAccountId, toAccountNumber, amount
 */
exports.transfer = async (req, res, next) => {
  try {
    const { fromAccountId, toAccountNumber, amount } = req.body;

    if (!fromAccountId || !toAccountNumber || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid fromAccountId, toAccountNumber and amount required",
      });
    }

    const fromAccount = await Account.findOne({
      _id: fromAccountId,
      userId: req.user._id,
    });
    if (!fromAccount) {
      return res.status(404).json({ success: false, message: "Source account not found" });
    }
    if (fromAccount.status !== "active") {
      return res.status(400).json({ success: false, message: "Source account is frozen" });
    }

    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAccount) {
      return res.status(404).json({ success: false, message: "Destination account not found" });
    }
    if (toAccount.status !== "active") {
      return res.status(400).json({ success: false, message: "Destination account is frozen" });
    }
    if (fromAccount._id.toString() === toAccount._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot transfer to same account" });
    }

    const minRequired = MIN_BALANCE[fromAccount.accountType];
    if (fromAccount.balance - amount < minRequired) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Minimum ${fromAccount.accountType} balance: ₹${minRequired}`,
      });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;
    await fromAccount.save();
    await toAccount.save();

    await Transaction.create({
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      amount,
      type: "transfer",
      description: `Transfer to ${toAccountNumber}`,
      accountId: fromAccount._id,
    });
    await Transaction.create({
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      amount,
      type: "transfer",
      description: `Transfer from ${fromAccount.accountNumber}`,
      accountId: toAccount._id,
    });

    const User = require("../models/User");
    const toUser = await User.findById(toAccount.userId);
    sendEmail(
      req.user.email,
      "Transfer Alert - KodnestBank",
      `₹${amount} transferred to ${toAccountNumber}. New balance: ₹${fromAccount.balance}`
    ).catch(() => {});
    if (toUser && toUser.email) {
      sendEmail(
        toUser.email,
        "Credit Alert - KodnestBank",
        `₹${amount} received from ${fromAccount.accountNumber}`
      ).catch(() => {});
    }

    res.json({
      success: true,
      message: "Transfer successful",
      newBalance: fromAccount.balance,
    });
  } catch (error) {
    next(error);
  }
};
