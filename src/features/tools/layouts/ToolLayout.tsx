import React, { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { getToolEntry } from "@/features/tools/registry/toolRegistry";

const LoadingFallback: React.FC = () => (
  <div className="rounded-3xl border border-dashed border-slate-300/70 bg-white/60 p-8 text-center text-sm text-slate-500 shadow-inner dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
    <p className="animate-pulse tracking-[0.3em] text-xs uppercase text-slate-400 dark:text-slate-500">Loading</p>
    <p className="mt-2 text-sm">正在唤醒工具模块…</p>
  </div>
);

const UnknownTool: React.FC<{ toolId: string }> = ({ toolId }) => (
  <div className="space-y-4 rounded-3xl border border-rose-200/60 bg-rose-50/80 p-8 text-sm text-rose-600 shadow-inner shadow-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
    <p className="text-xs uppercase tracking-[0.3em]">Tool Missing</p>
    <p className="text-base font-medium">未找到 ID 为「{toolId}」的工具模块。</p>
    <p className="text-sm">
      <Link to="/" className="font-semibold underline underline-offset-4">
        返回工具首页
      </Link>
      再试一次，或执行 <code>scripts/create-tool.sh {toolId || "<tool-id>"}</code> 快速生成。
    </p>
  </div>
);

export const ToolLayout: React.FC = () => {
  const { toolId = "" } = useParams<{ toolId: string }>();
  const entry = getToolEntry(toolId);

  if (!entry || entry.meta.disabled) {
    return <UnknownTool toolId={toolId} />;
  }

  const ToolComponent = React.lazy(entry.load);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-[0_25px_60px_rgba(99,102,241,0.12)] dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Tool Detail</p>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{entry.meta.name}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{entry.meta.description}</p>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200"
        >
          <span className="text-lg">←</span> 返回目录
        </Link>
      </header>
      <Suspense fallback={<LoadingFallback />}>
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-[0_30px_90px_rgba(99,102,241,0.15)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-none sm:p-8">
          <ToolComponent />
        </div>
      </Suspense>
    </section>
  );
};
