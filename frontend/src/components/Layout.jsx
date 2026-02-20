/**
 * App Layout - Header with nav, profile dropdown, dark mode toggle
 */
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import ProfileDropdown from "./ProfileDropdown";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="text-xl font-bold">
          KodnestBank
        </Link>
        <nav className="flex items-center gap-4 flex-wrap">
          {user.role === "customer" && (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/create-account" className="hover:underline">Create Account</Link>
            </>
          )}
          {user.role === "admin" && (
            <Link to="/admin" className="hover:underline">Admin</Link>
          )}
          <DarkModeToggle />
          <ProfileDropdown />
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
