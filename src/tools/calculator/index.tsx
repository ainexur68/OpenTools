import React, { useMemo, useState } from "react";
import toolMeta, { toolId } from "./meta";
import {
  computeCalculatorResults,
  formatNumericResult,
  initialCalculatorState,
  type CalculatorState
} from "./logic";

export { toolId, toolMeta };

export const CalculatorTool: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(initialCalculatorState);

  const result = useMemo(() => computeCalculatorResults(state), [state]);

  const updateField = (field: keyof CalculatorState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setState((prev) => ({ ...prev, [field]: nextValue }));
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{toolMeta.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{toolMeta.description}</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">第一个数字</span>
            <input
              type="number"
              inputMode="decimal"
              value={state.first}
              onChange={updateField("first")}
              placeholder="例如 123.45"
              className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">第二个数字</span>
            <input
              type="number"
              inputMode="decimal"
              value={state.second}
              onChange={updateField("second")}
              placeholder="例如 6"
              className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </label>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">实时更新计算结果，支持复制。</p>
      </section>

      <section className="space-y-4 rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-4 text-sm text-slate-700 shadow-sm dark:border-indigo-500/50 dark:bg-indigo-950/40 dark:text-indigo-100">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">运算结果</h2>
          <p className="text-xs opacity-80">若除数为 0 或指数非法，将提示无法计算。</p>
        </header>
        {result ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <ResultItem label="加法" value={formatNumericResult(result.sum)} />
            <ResultItem label="减法" value={formatNumericResult(result.difference)} />
            <ResultItem label="乘法" value={formatNumericResult(result.product)} />
            <ResultItem
              label="除法"
              value={result.quotient === null ? "无法计算（除数为 0）" : formatNumericResult(result.quotient)}
            />
            <ResultItem
              label="取余"
              value={result.remainder === null ? "无法计算（除数为 0）" : formatNumericResult(result.remainder)}
            />
            <ResultItem label="指数" value={result.power === null ? "无法计算" : formatNumericResult(result.power)} />
          </dl>
        ) : (
          <p className="text-xs">请输入两个有效数字以查看计算结果。</p>
        )}
      </section>
    </div>
  );
};

interface ResultItemProps {
  readonly label: string;
  readonly value: string;
}

const ResultItem: React.FC<ResultItemProps> = ({ label, value }) => {
  const handleCopy = async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        console.warn("当前环境不支持剪贴板 API");
        return;
      }

      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("复制失败", error);
    }
  };

  return (
    <div className="space-y-1 rounded-lg border border-indigo-200/80 bg-white/80 p-3 text-indigo-900 shadow-sm transition hover:border-indigo-300 dark:border-indigo-500/40 dark:bg-indigo-900/50 dark:text-indigo-100">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
        <span>{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-indigo-200/70 px-2 py-0.5 text-[10px] font-medium text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-800/60"
        >
          复制
        </button>
      </div>
      <div className="font-mono text-base break-words">{value}</div>
    </div>
  );
};

export default CalculatorTool;
