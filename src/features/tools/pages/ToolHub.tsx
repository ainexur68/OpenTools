import React, { useMemo, useState } from "react";
import { toolMetaList } from "@/features/tools/registry/toolRegistry";
import { ToolCard } from "@/features/tools/components/ToolCard";

const availableTools = toolMetaList.filter((tool) => !tool.disabled);

const filterCategories = availableTools.reduce<Record<string, number>>((acc, tool) => {
  if (!tool.category) {
    return acc;
  }
  acc[tool.category] = (acc[tool.category] ?? 0) + 1;
  return acc;
}, {});

export const ToolHubPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");

  const categories = useMemo(() => ["全部", ...Object.keys(filterCategories)], []);

  const filteredTools = useMemo(() => {
    return availableTools.filter((tool) => {
      const matchCategory = activeCategory === "全部" || tool.category === activeCategory;
      if (!matchCategory) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const keyword = search.toLowerCase();
      return (
        tool.name.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword) ||
        tool.keywords?.some((item) => item.toLowerCase().includes(keyword))
      );
    });
  }, [activeCategory, search]);

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">DeepWiki Collection</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">工具档案库</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            新增工具只需放入 <code>src/features/tools/modules/&lt;tool-id&gt;</code>，自动注册系统会将其展示在这里。
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索工具 / 关键词 / 描述..."
              className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3 text-sm text-slate-700 shadow-inner shadow-indigo-100 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none dark:focus:border-indigo-300 dark:focus:ring-indigo-400/10"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              CTRL+K
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const pillBase =
                "rounded-full border px-4 py-1.5 text-xs font-medium transition hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-200";
              const stateClass = isActive
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:border-indigo-300 dark:text-indigo-100"
                : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400";

              const count = category === "全部" ? availableTools.length : filterCategories[category];
              return (
                <button
                  key={category}
                  type="button"
                  className={`${pillBase} ${stateClass}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                  <span className="ml-1 text-[0.7rem] opacity-70">({count ?? 0})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
        {filteredTools.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300/70 bg-white/70 p-8 text-center text-sm text-slate-500 shadow-inner shadow-indigo-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            未找到匹配的工具。尝试更换关键词或执行 <code>scripts/create-tool.sh</code> 增加新工具吧！
          </div>
        )}
      </div>
    </section>
  );
};
