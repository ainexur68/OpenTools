import React from "react";
import { toolMetaList } from "@/features/tools/registry/toolRegistry";
import { ToolCard } from "@/features/tools/components/ToolCard";

const visibleTools = toolMetaList.filter((tool) => !tool.disabled);

export const ToolHubPage: React.FC = () => {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">常用工具</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          新增工具只需放入 <code>src/features/tools/modules/&lt;tool-id&gt;</code> 目录，即可通过自动注册系统出现在此处。
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
        {visibleTools.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
            暂无可用工具。运行 <code>scripts/create-tool.sh</code> 生成新的工具模块吧！
          </div>
        )}
      </div>
    </section>
  );
};
