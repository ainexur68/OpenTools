import React, { useMemo, useState } from "react";
import toolMeta, { toolId } from "./meta";
import { analyzeDependencies, getDisplayList, type PackageManager } from "./logic";

export { toolId, toolMeta };

const defaultRuntimeExpected = `{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.30.2"
}`;

const defaultRuntimeInstalled = `react@18.2.0\nreact-dom@18.2.0`;

const defaultDevExpected = `{
  "@types/react": "^18.2.41",
  "@types/react-dom": "^18.2.17",
  "@vitejs/plugin-react": "^4.0.0",
  "typescript": "^5.5.0",
  "vite": "^4.5.0"
}`;

const defaultDevInstalled = `@types/react@18.2.41\n@types/react-dom@18.2.17\ntypescript@5.5.0\nvite@4.5.0`;

const packageManagers: readonly { id: PackageManager; label: string; hint: string }[] = [
  { id: "npm", label: "npm", hint: "适用于 npm install" },
  { id: "pnpm", label: "pnpm", hint: "适用于 pnpm add" },
  { id: "yarn", label: "Yarn", hint: "适用于 yarn add" }
] as const;

const SectionHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <header className="space-y-1">
    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
  </header>
);

const CommandDisplay: React.FC<{ label: string; command: string | null }> = ({ label, command }) => {
  if (!command) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
        {label}：无需安装，已满足要求。
      </p>
    );
  }

  const handleCopy = async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        console.warn("当前环境不支持剪贴板 API");
        return;
      }

      await navigator.clipboard.writeText(command);
    } catch (error) {
      console.error("复制命令失败", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-indigo-200/70 bg-white/80 px-3 py-2 text-xs text-indigo-900 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/40 dark:text-indigo-100 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-medium">{label}：</span>
      <code className="flex-1 break-all rounded bg-indigo-900/10 px-2 py-1 font-mono text-[11px] dark:bg-indigo-300/10">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        className="self-start rounded-full border border-indigo-200/80 px-3 py-1 text-[11px] font-medium text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-800/60"
      >
        复制
      </button>
    </div>
  );
};

const PackageBadgeList: React.FC<{ items: string[]; emptyLabel: string; tone: "warning" | "info" }> = ({
  items,
  emptyLabel,
  tone
}) => {
  if (items.length === 0) {
    return <p className="text-xs text-slate-500 dark:text-slate-400">{emptyLabel}</p>;
  }

  const toneClasses =
    tone === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800/50"
      : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800/50";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium ${toneClasses}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export const DependencyCheckerTool: React.FC = () => {
  const [runtimeExpected, setRuntimeExpected] = useState(defaultRuntimeExpected);
  const [runtimeInstalled, setRuntimeInstalled] = useState(defaultRuntimeInstalled);
  const [devExpected, setDevExpected] = useState(defaultDevExpected);
  const [devInstalled, setDevInstalled] = useState(defaultDevInstalled);
  const [manager, setManager] = useState<PackageManager>("npm");

  const analysis = useMemo(
    () =>
      analyzeDependencies({
        runtimeExpected,
        runtimeInstalled,
        devExpected,
        devInstalled,
        manager
      }),
    [runtimeExpected, runtimeInstalled, devExpected, devInstalled, manager]
  );

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white/85 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200">
        <header className="space-y-2">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{toolMeta.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{toolMeta.description}</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">期望依赖（dependencies）</span>
            <textarea
              value={runtimeExpected}
              onChange={(event) => setRuntimeExpected(event.target.value)}
              className="min-h-[160px] rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-xs font-mono text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">已安装依赖（可选）</span>
            <textarea
              value={runtimeInstalled}
              onChange={(event) => setRuntimeInstalled(event.target.value)}
              className="min-h-[160px] rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-xs font-mono text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
              placeholder="例如 npm ls 输出或 package-lock.json 中的版本"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">期望开发依赖（devDependencies）</span>
            <textarea
              value={devExpected}
              onChange={(event) => setDevExpected(event.target.value)}
              className="min-h-[160px] rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-xs font-mono text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">已安装开发依赖（可选）</span>
            <textarea
              value={devInstalled}
              onChange={(event) => setDevInstalled(event.target.value)}
              className="min-h-[160px] rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-xs font-mono text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">包管理器</span>
          <select
            value={manager}
            onChange={(event) => setManager(event.target.value as PackageManager)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
          >
            {packageManagers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} —— {item.hint}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-4 text-sm text-slate-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-100">
        <SectionHeader title="运行时依赖结果" description="检查 dependencies 是否缺失或冗余。" />
        <div className="space-y-3">
          <div className="space-y-2 rounded-lg border border-amber-200/70 bg-amber-50/60 p-3 text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-100">
            <h3 className="text-xs font-semibold uppercase tracking-wide">缺失的依赖</h3>
            <PackageBadgeList
              tone="warning"
              items={getDisplayList(analysis.runtime.missing)}
              emptyLabel="未检测到缺失依赖。"
            />
          </div>
          <div className="space-y-2 rounded-lg border border-emerald-200/70 bg-white/80 p-3 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100">
            <h3 className="text-xs font-semibold uppercase tracking-wide">多余的依赖</h3>
            <PackageBadgeList
              tone="info"
              items={getDisplayList(analysis.runtime.extra)}
              emptyLabel="未检测到多余依赖。"
            />
          </div>
          <CommandDisplay label="运行时安装命令" command={analysis.runtime.installCommand} />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-indigo-200/70 bg-indigo-50/60 p-4 text-sm text-slate-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/40 dark:text-indigo-100">
        <SectionHeader title="开发依赖结果" description="对 devDependencies 进行同样的比对。" />
        <div className="space-y-3">
          <div className="space-y-2 rounded-lg border border-amber-200/70 bg-amber-50/60 p-3 text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-100">
            <h3 className="text-xs font-semibold uppercase tracking-wide">缺失的开发依赖</h3>
            <PackageBadgeList
              tone="warning"
              items={getDisplayList(analysis.dev.missing)}
              emptyLabel="未检测到缺失的开发依赖。"
            />
          </div>
          <div className="space-y-2 rounded-lg border border-emerald-200/70 bg-white/80 p-3 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100">
            <h3 className="text-xs font-semibold uppercase tracking-wide">多余的开发依赖</h3>
            <PackageBadgeList
              tone="info"
              items={getDisplayList(analysis.dev.extra)}
              emptyLabel="未检测到多余的开发依赖。"
            />
          </div>
          <CommandDisplay label="开发依赖安装命令" command={analysis.dev.installCommand} />
        </div>
      </section>
    </div>
  );
};

export default DependencyCheckerTool;
