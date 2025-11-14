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
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-800/60 dark:bg-slate-900/80"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tool.name}</div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{tool.category}</p>
        </div>
        <ToolIcon name={tool.icon} className="h-10 w-10 flex-shrink-0 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <p className="text-xs text-slate-600 transition group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200">
        {tool.description}
      </p>
    </Link>
  );
};
