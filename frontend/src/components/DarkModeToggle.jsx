/**
 * Dark Mode Toggle
 * Toggles dark class on document for Tailwind dark mode
 */
import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg dark:bg-yellow-400 dark:text-black hover:opacity-90 transition"
    >
      {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
