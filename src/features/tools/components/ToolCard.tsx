import React from "react";
import { Link } from "react-router-dom";
import type { ToolMeta } from "@/features/tools/registry/toolTypes";
import { ToolIcon } from "./ToolIcon";

export interface ToolCardProps {
  readonly tool: ToolMeta;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <Link
      to={tool.route}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-left shadow-lg shadow-[0_25px_60px_rgba(99,102,241,0.12)] transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_30px_80px_rgba(99,102,241,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-none"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/90 to-purple-500/90 p-2.5 text-white shadow-lg shadow-[0_10px_30px_rgba(109,40,217,0.45)] dark:shadow-none">
          <ToolIcon name={tool.icon} className="h-8 w-8 rounded-lg text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            {tool.category || "工具"}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
        </div>
      </div>

      <p className="flex-1 text-sm text-slate-600 transition group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100">
        {tool.description}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap gap-2">
          {tool.keywords?.slice(0, 2).map((keyword) => (
            <span key={keyword} className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] dark:bg-slate-800/80">
              {keyword}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-indigo-500 transition group-hover:translate-x-1 dark:text-indigo-300">
          Explore
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-current">
            <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
};
