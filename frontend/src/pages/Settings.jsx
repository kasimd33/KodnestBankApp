/**
 * Settings Page - Update profile (name, mobile)
 */
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Settings() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setName(user.name || "");
    setMobile(user.mobile || "");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);
    api
      .put("/auth/profile", { name, mobile })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.user));
        setMessage({ type: "success", text: "Profile updated successfully" });
      })
      .catch((err) => setMessage({ type: "error", text: err.message }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
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
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Mobile No</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g. 9876543210"
            className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
