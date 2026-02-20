/**
 * Admin Dashboard - Analytics, customers, accounts, freeze/unfreeze, transactions
 */
import { useState, useEffect } from "react";
import api from "../services/api";
import { downloadStatement } from "../utils/downloadStatement";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState("analytics");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const fetchAnalytics = () => api.get("/admin/analytics").then((r) => setAnalytics(r.analytics));
  const fetchCustomers = () => api.get("/admin/customers").then((r) => setCustomers(r.customers || []));
  const fetchAccounts = () => api.get("/admin/accounts").then((r) => setAccounts(r.accounts || []));
  const fetchTransactions = () => api.get("/admin/transactions").then((r) => setTransactions(r.transactions || []));

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchCustomers(), fetchAccounts(), fetchTransactions()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const toggleFreeze = (account, freeze) => {
    setActionLoading(account._id);
    api
      .put(`/admin/accounts/${account._id}/${freeze ? "freeze" : "unfreeze"}`)
      .then(() => fetchAccounts())
      .finally(() => setActionLoading(""));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <nav className="flex gap-4 mb-6 border-b dark:border-gray-600">
        {["analytics", "customers", "accounts", "transactions"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-2 capitalize ${tab === t ? "border-b-2 border-indigo-600" : ""}`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "analytics" && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-indigo-500 text-white p-6 rounded-xl shadow">
            <h2 className="text-lg">Total Users</h2>
            <p className="text-2xl font-bold">{analytics.totalUsers}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-xl shadow">
            <h2 className="text-lg">Total Accounts</h2>
            <p className="text-2xl font-bold">{analytics.totalAccounts}</p>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
            <h2 className="text-lg">Total Balance</h2>
            <p className="text-2xl font-bold">₹ {Number(analytics.totalBalance).toLocaleString()}</p>
          </div>
          <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
            <h2 className="text-lg">Total Transactions</h2>
            <p className="text-2xl font-bold">{analytics.totalTransactions}</p>
          </div>
        </div>
      )}

      {tab === "customers" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b dark:border-gray-600">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "accounts" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 px-4 text-left">Account</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Balance</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Customer</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a._id} className="border-b dark:border-gray-600">
                  <td className="py-2 px-4">{a.accountNumber}</td>
                  <td className="py-2 px-4">{a.accountType}</td>
                  <td className="py-2 px-4">₹{Number(a.balance).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        a.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{a.userId?.name || "-"}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => toggleFreeze(a, a.status === "active")}
                      disabled={actionLoading === a._id}
                      className={`px-3 py-1 rounded text-sm ${
                        a.status === "active"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {a.status === "active" ? "Freeze" : "Unfreeze"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "transactions" && (
        <div className="space-y-4">
          <button
            onClick={() => downloadStatement(transactions)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Download PDF
          </button>
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-gray-600">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Account</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} className="border-b dark:border-gray-600">
                    <td className="py-2 px-4">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 capitalize">{t.type}</td>
                    <td className="py-2 px-4">₹{Number(t.amount).toLocaleString()}</td>
                    <td className="py-2 px-4">{t.accountId?.accountNumber || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
