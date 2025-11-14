import React, { useEffect, useMemo, useState } from "react";
import toolMeta, { toolId } from "./meta";
import { computeHash, initialHashResult, type SupportedHashAlgorithm } from "./logic";

export { toolId, toolMeta };

const algorithms: readonly { id: SupportedHashAlgorithm; label: string; hint: string }[] = [
  { id: "MD5", label: "MD5", hint: "通用摘要算法，速度快，适合校验" },
  { id: "SHA-1", label: "SHA-1", hint: "安全性较 MD5 提升，仍不建议用于密码学" },
  { id: "SHA-256", label: "SHA-256", hint: "SHA-2 家族，现代应用常用算法" }
] as const;

const algorithmOrder = algorithms.map((item) => item.id) as readonly SupportedHashAlgorithm[];
const createEmptyResults = () => initialHashResult(algorithmOrder);

interface HashState {
  readonly input: string;
  readonly uppercase: boolean;
}

type HashResultMap = Record<SupportedHashAlgorithm, string>;

export const HashCalculatorTool: React.FC = () => {
  const [state, setState] = useState<HashState>({ input: "", uppercase: false });
  const [results, setResults] = useState<HashResultMap>(() => createEmptyResults());
  const [isComputing, setIsComputing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const text = state.input;

      if (!text) {
        setResults(createEmptyResults());
        setErrorMessage(null);
        setIsComputing(false);
        return;
      }

      setIsComputing(true);
      setErrorMessage(null);

      try {
        const computed = await Promise.all(
          algorithmOrder.map(async (algorithm) => {
            const value = await computeHash(algorithm, text);
            return [algorithm, value.toLowerCase()] as const;
          })
        );

        if (!cancelled) {
          setResults(
            computed.reduce<HashResultMap>((acc, [algorithm, value]) => {
              acc[algorithm] = value;
              return acc;
            }, createEmptyResults())
          );
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "计算失败";
          setErrorMessage(message);
          setResults(createEmptyResults());
        }
      } finally {
        if (!cancelled) {
          setIsComputing(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [state.input]);

  const displayResults = useMemo(() => {
    return algorithms.reduce<HashResultMap>((acc, item) => {
      acc[item.id] = state.uppercase ? results[item.id]?.toUpperCase() : results[item.id];
      return acc;
    }, createEmptyResults());
  }, [results, state.uppercase]);

  const handleCopy = async (value: string) => {
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

  const toggleUppercase = () => {
    setState((prev) => ({ ...prev, uppercase: !prev.uppercase }));
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{toolMeta.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{toolMeta.description}</p>
        </header>
        <div className="space-y-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">输入文本</span>
            <textarea
              value={state.input}
              onChange={(event) => setState((prev) => ({ ...prev, input: event.target.value }))}
              placeholder="在此输入需要计算哈希的文本内容"
              className="min-h-[160px] rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={toggleUppercase}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {state.uppercase ? "切换为小写" : "切换为大写"}
            </button>
            <span>切换结果展示格式，便于比对。</span>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-sm text-slate-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-100">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">哈希结果</h2>
          <p className="text-xs opacity-80">输入变更后自动重新计算，可单独复制任意算法结果。</p>
        </header>
        {errorMessage && <p className="text-xs text-emerald-900 dark:text-emerald-200">{errorMessage}</p>}
        {isComputing && !errorMessage && (
          <p className="text-xs text-emerald-900 dark:text-emerald-200">正在计算，请稍候…</p>
        )}
        {!state.input && <p className="text-xs">请输入文本以查看哈希值。</p>}
        {state.input && !errorMessage && (
          <dl className="space-y-3">
            {algorithms.map((item) => (
              <div
                key={item.id}
                className="space-y-2 rounded-lg border border-emerald-200/80 bg-white/90 p-3 text-emerald-900 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/50 dark:text-emerald-100"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-500 dark:text-emerald-300">{item.label}</dt>
                    <dd className="text-[11px] text-emerald-500/80 dark:text-emerald-200/70">{item.hint}</dd>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(displayResults[item.id])}
                    className="self-start rounded-full border border-emerald-200/80 px-3 py-1 text-[11px] font-medium text-emerald-600 transition hover:bg-emerald-100 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:bg-emerald-800/60"
                  >
                    复制
                  </button>
                </div>
                <dd className="font-mono text-sm break-all">{displayResults[item.id]}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  );
};

export default HashCalculatorTool;
