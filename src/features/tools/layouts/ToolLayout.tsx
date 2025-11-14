import React, { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { getToolEntry } from "@/features/tools/registry/toolRegistry";

const LoadingFallback: React.FC = () => (
  <div className="rounded-xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-300">
    正在加载工具模块…
  </div>
);

const UnknownTool: React.FC<{ toolId: string }> = ({ toolId }) => (
  <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-200">
    <p>未找到 ID 为「{toolId}」的工具模块。</p>
    <p>
      返回<Link to="/" className="ml-1 underline">
        工具首页
      </Link>
      继续浏览。
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
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{entry.meta.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{entry.meta.description}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← 返回首页
        </Link>
      </header>
      <Suspense fallback={<LoadingFallback />}>
        <ToolComponent />
      </Suspense>
    </section>
  );
};
