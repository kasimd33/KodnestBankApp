/**
 * Profile Dropdown - Top right corner
 * Shows: Name, Account Number, Account Type, Mobile, Settings
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    api.get("/auth/me").then((r) => {
      setUser(r.user);
      localStorage.setItem("user", JSON.stringify(r.user));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.role === "customer") {
      api.get("/accounts/my-accounts").then((r) => {
        const accounts = r.accounts || [];
        setAccount(accounts[0] || null);
      }).catch(() => setAccount(null));
    }
  }, [user?.role]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      >
        <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
          {user.name?.charAt(0)?.toUpperCase() || "?"}
        </span>
        <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
        <span className="text-gray-500">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 py-3 z-50">
          <div className="px-4 py-2 border-b dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>
          {user.role === "customer" ? (
            <>
              <div className="px-4 py-2 border-b dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">Account Number</p>
                <p className="font-medium">{account?.accountNumber || "No account"}</p>
              </div>
              <div className="px-4 py-2 border-b dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">Account Type</p>
                <p className="font-medium">{account?.accountType || "-"}</p>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">Account Number</p>
                <p className="font-medium">Admin</p>
              </div>
              <div className="px-4 py-2 border-b dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">Account Type</p>
                <p className="font-medium">Administrator</p>
              </div>
            </>
          )}
          <div className="px-4 py-2 border-b dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">Mobile No</p>
            <p className="font-medium">{user.mobile || "Not set"}</p>
          </div>
          <div className="px-4 pt-2">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
