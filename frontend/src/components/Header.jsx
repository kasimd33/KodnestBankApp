/**
 * Header Component - App navigation with theme toggle, profile, logout
 */
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-card border-b border-border shadow px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="text-xl font-bold text-foreground font-archivo">
        KodnestBank
      </Link>
      <nav className="flex items-center gap-4 flex-wrap text-foreground">
        {user.role === "customer" && (
          <>
            <Link to="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/create-account" className="hover:text-primary transition-colors">
              Create Account
            </Link>
          </>
        )}
        {user.role === "admin" && (
          <Link to="/admin" className="hover:text-primary transition-colors">
            Admin
          </Link>
        )}
        <DarkModeToggle />
        <ProfileDropdown />
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
