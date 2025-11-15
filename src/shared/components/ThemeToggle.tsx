import React from "react";
import { useTheme } from "@/shared/theme/useTheme";

const iconMap = {
  light: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-500">
      <path
        d="M12 5v1M12 18v1M5 12H4m17 0h-1m-1.95-5.95-.7.71m0 10.48.7.71M7.05 6.05l-.7.71m0 10.48.7.71M12 8a4 4 0 100 8 4 4 0 000-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  dark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-indigo-300">
      <path
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
};

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-[0_10px_30px_rgba(99,102,241,0.15)] transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-indigo-300 dark:hover:text-indigo-200"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        {isDark ? iconMap.dark : iconMap.light}
      </span>
      {isDark ? "DARK" : "LIGHT"}
    </button>
  );
};
