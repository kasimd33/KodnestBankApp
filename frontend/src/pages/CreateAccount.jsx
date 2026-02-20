/**
 * Create Account Page - Savings or Current
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateAccount() {
  const [accountType, setAccountType] = useState("Savings");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const minAmount = accountType === "Savings" ? 1000 : 5000;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const amt = parseFloat(initialDeposit);
    if (!amt || amt < minAmount) {
      setError(`${accountType} requires minimum ₹${minAmount}`);
      return;
    }
    setLoading(true);
    api
      .post("/accounts/create", { accountType, initialDeposit: amt })
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Account</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Account Type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
          >
            <option value="Savings">Savings (Min ₹1,000)</option>
            <option value="Current">Current (Min ₹5,000)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Initial Deposit (Min ₹{minAmount.toLocaleString()})
          </label>
          <input
            type="number"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
            min={minAmount}
            step="100"
            className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
            placeholder={`₹${minAmount.toLocaleString()}`}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
