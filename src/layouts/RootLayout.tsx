import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useTheme } from "@/shared/theme/useTheme";

export const RootLayout: React.FC = () => {
  const { isDark } = useTheme();

  const pageBg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
  const headerHint = isDark ? "text-slate-400" : "text-slate-500";
  const footerBorder = isDark ? "border-slate-800/60" : "border-slate-200";
  const footerText = "text-slate-500";

  return (
    <div className={`min-h-screen ${pageBg} transition-colors`}>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">OpenTools</h1>
            <p className={`mt-1 text-xs sm:text-sm ${headerHint}`}>一站式小工具集合 · 支持主题切换</p>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className={`mt-8 border-t pt-4 text-xs ${footerBorder} ${footerText}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>OpenTools · Vite + React + TypeScript · Tailwind CSS</span>
            <span className={headerHint}>由脚本驱动的工具模块体系</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
