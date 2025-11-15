import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useTheme } from "@/shared/theme/useTheme";

export const RootLayout: React.FC = () => {
  const { isDark } = useTheme();

  const gradient = isDark
    ? "from-slate-950 via-slate-900 to-slate-950 text-slate-50"
    : "from-[#f7f5ff] via-white to-[#f3f1ff] text-slate-900";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} transition-colors`}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-10">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/85 px-5 py-4 text-sm text-slate-600 shadow-xl shadow-[0_25px_60px_rgba(99,102,241,0.12)] dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-200 dark:shadow-none sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
              <span>DeepWiki · OpenTools</span>
              <span className="text-[0.65rem] text-slate-400 dark:text-slate-500">Vite · React · TypeScript</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                沉浸式工具中枢 · 自动注册 · 脚本驱动 · 暗夜/亮昼一键切换
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1">
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl shadow-[0_25px_70px_rgba(99,102,241,0.18)] backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-none sm:p-8">
            <Outlet />
          </div>
        </main>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/80 px-6 py-4 text-xs text-slate-500 shadow-lg shadow-[0_15px_45px_rgba(99,102,241,0.18)] dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-400">
          <span>OpenTools · A DeepWiki-inspired utility space.</span>
          <span>构建脚本：scripts/create-tool.sh · scripts/extend-icons.sh</span>
        </footer>
      </div>
    </div>
  );
};
