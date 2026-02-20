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
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-secondary transition"
      >
        <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
          {user.name?.charAt(0)?.toUpperCase() || "?"}
        </span>
        <span className="hidden sm:inline text-sm font-medium text-foreground">{user.name}</span>
        <span className="text-muted-foreground">▼</span>
      </button>

      {open && (
        <div 
          className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl border border-border py-3 z-50"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="px-4 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-semibold text-foreground">{user.name}</p>
          </div>
          {user.role === "customer" ? (
            <>
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="font-medium text-foreground font-michroma">{account?.accountNumber || "No account"}</p>
              </div>
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Account Type</p>
                <p className="font-medium text-foreground">{account?.accountType || "-"}</p>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="font-medium text-foreground">Admin</p>
              </div>
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Account Type</p>
                <p className="font-medium text-foreground">Administrator</p>
              </div>
            </>
          )}
          <div className="px-4 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground">Mobile No</p>
            <p className="font-medium text-foreground">{user.mobile || "Not set"}</p>
          </div>
          <div className="px-4 pt-2">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-accent rounded-lg transition"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
