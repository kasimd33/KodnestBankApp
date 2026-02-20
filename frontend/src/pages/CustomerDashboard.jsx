/**
 * Customer Dashboard - Balance, deposits, withdrawals, chart, transactions
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import DashboardChart from "../components/DashboardChart";
import TransactionTable from "../components/TransactionTable";
import { downloadStatement } from "../utils/downloadStatement";

export default function CustomerDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchAccounts = () => {
    api
      .get("/accounts/my-accounts")
      .then((res) => {
        setAccounts(res.accounts || []);
        if (res.accounts?.length && !selectedAccount) {
          setSelectedAccount(res.accounts[0]);
        }
      })
      .catch(() => setMessage({ type: "error", text: "Failed to load accounts" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (!selectedAccount?._id) return;
    api
      .get(`/transactions/${selectedAccount._id}`)
      .then((res) => {
        setTransactions(res.transactions || []);
        setBalance(res.accountBalance || 0);
        setTotalDeposits(res.totalDeposits || 0);
        setTotalWithdrawals(res.totalWithdrawals || 0);
      })
      .catch(() => setTransactions([]));
  }, [selectedAccount]);

  const doAction = (fn, type) => {
    setActionLoading(type);
    setMessage({ type: "", text: "" });
    fn()
      .then(() => {
        setMessage({ type: "success", text: "Success!" });
        setDepositAmount("");
        setWithdrawAmount("");
        setTransferTo("");
        setTransferAmount("");
        fetchAccounts();
        if (selectedAccount) {
          api.get(`/transactions/${selectedAccount._id}`).then((res) => {
            setTransactions(res.transactions || []);
            setBalance(res.accountBalance || 0);
            setTotalDeposits(res.totalDeposits || 0);
            setTotalWithdrawals(res.totalWithdrawals || 0);
          });
        }
      })
      .catch((err) => setMessage({ type: "error", text: err.message }))
      .finally(() => setActionLoading(""));
  };

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    doAction(() => api.post("/accounts/deposit", { accountId: selectedAccount._id, amount: amt }), "deposit");
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) return;
    doAction(() => api.post("/accounts/withdraw", { accountId: selectedAccount._id, amount: amt }), "withdraw");
  };

  const handleTransfer = () => {
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0 || !transferTo.trim()) return;
    doAction(
      () =>
        api.post("/accounts/transfer", {
          fromAccountId: selectedAccount._id,
          toAccountNumber: transferTo.trim(),
          amount: amt,
        }),
      "transfer"
    );
  };

  const handleDownloadPDF = () => {
    downloadStatement(transactions, selectedAccount?.accountNumber);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!accounts.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl mb-4">No accounts yet</h2>
        <Link to="/create-account" className="text-indigo-600 hover:underline">
          Create your first account
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome Back 👋</h1>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "error"
              ? "bg-red-100 dark:bg-red-900/30 text-red-700"
              : "bg-green-100 dark:bg-green-900/30 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Account</label>
        <select
          value={selectedAccount?._id || ""}
          onChange={(e) =>
            setSelectedAccount(accounts.find((a) => a._id === e.target.value))
          }
          className="px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
        >
          {accounts.map((a) => (
            <option key={a._id} value={a._id}>
              {a.accountNumber} ({a.accountType}) - ₹{Number(a.balance).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg">Current Balance</h2>
          <p className="text-2xl font-bold mt-2">₹ {Number(balance).toLocaleString()}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
          <h2>Total Deposits</h2>
          <p className="text-2xl font-bold mt-2">₹ {Number(totalDeposits).toLocaleString()}</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg">
          <h2>Total Withdrawals</h2>
          <p className="text-2xl font-bold mt-2">₹ {Number(totalWithdrawals).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Deposit</h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="flex-1 px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
            />
            <button
              onClick={handleDeposit}
              disabled={actionLoading || selectedAccount?.status === "frozen"}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading === "deposit" ? "..." : "Deposit"}
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Withdraw</h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="flex-1 px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
            />
            <button
              onClick={handleWithdraw}
              disabled={actionLoading || selectedAccount?.status === "frozen"}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading === "withdraw" ? "..." : "Withdraw"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Transfer</h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="To Account Number"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded w-32"
          />
          <button
            onClick={handleTransfer}
            disabled={actionLoading || selectedAccount?.status === "frozen"}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {actionLoading === "transfer" ? "..." : "Transfer"}
          </button>
        </div>
      </div>

      <DashboardChart balance={balance} deposits={totalDeposits} withdrawals={totalWithdrawals} />

      <TransactionTable transactions={transactions} onDownloadPDF={handleDownloadPDF} />
    </div>
  );
}
