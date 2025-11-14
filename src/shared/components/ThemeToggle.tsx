import React from "react";
import { useTheme } from "@/shared/theme/useTheme";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "暗色模式" : "亮色模式"}</span>
    </button>
  );
};
