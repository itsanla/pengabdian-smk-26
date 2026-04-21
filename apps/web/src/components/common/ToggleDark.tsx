"use client";

import { useState, useEffect } from "react";

export default function ToggleDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="dark:bg-gray-800 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-1 rounded"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
