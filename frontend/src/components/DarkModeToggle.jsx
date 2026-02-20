/**
 * Dark Mode Toggle - Switch style theme changer
 * Toggles dark class on document for Tailwind dark mode
 */
import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        className="theme-checkbox"
        checked={dark}
        onChange={(e) => setDark(e.target.checked)}
      />
      <span className="theme-toggle-switch" />
      <span className="text-sm text-muted-foreground">{dark ? "Dark" : "Light"}</span>
    </label>
  );
};

export default DarkModeToggle;
