import React, { useState } from "react";
import toolMeta, { toolId } from "./meta";
import { decodeBase64ToText, encodeTextToBase64, sampleBase64Data } from "./logic";

export { toolId, toolMeta };

export const Base64ConverterTool: React.FC = () => {
  const [plainInput, setPlainInput] = useState<string>(sampleBase64Data.plain);
  const [encodedInput, setEncodedInput] = useState<string>(sampleBase64Data.encoded);
  const [encodedResult, setEncodedResult] = useState(() => encodeTextToBase64(sampleBase64Data.plain));
  const [decodedResult, setDecodedResult] = useState(() => {
    try {
      return decodeBase64ToText(sampleBase64Data.encoded);
    } catch {
      return "";
    }
  });
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const handleEncode = () => {
    const result = encodeTextToBase64(plainInput);
    setEncodedResult(result);
  };

  const handleDecode = () => {
    try {
      const decoded = decodeBase64ToText(encodedInput);
      setDecodedResult(decoded);
      setDecodeError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "无法解析 Base64 字符串。";
      setDecodeError(message);
      setDecodedResult("");
    }
  };

  const handleCopy = async (value: string) => {
    if (!value) {
      return;
    }
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
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white/85 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{toolMeta.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{toolMeta.description}</p>
        </header>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          两个面板分别支持「文本 → Base64」与「Base64 → 文本」，点击按钮即可转换，并可快速复制结果。
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-4 text-sm text-slate-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/30 dark:text-indigo-100">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-100">文本编码为 Base64</h2>
          <p className="text-xs opacity-80">输入任意文本内容，点击下方按钮快速得到 Base64 字符串。</p>
        </header>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-indigo-500 dark:text-indigo-200">输入文本</span>
          <textarea
            value={plainInput}
            onChange={(event) => setPlainInput(event.target.value)}
            placeholder="请输入需要编码的文本"
            className="min-h-[120px] rounded-lg border border-indigo-200/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-indigo-500/50 dark:bg-indigo-950/40 dark:text-indigo-100"
          />
        </label>
        <button
          type="button"
          onClick={handleEncode}
          className="inline-flex items-center justify-center rounded-lg border border-indigo-200/70 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 dark:border-indigo-500/50"
        >
          编码为 Base64
        </button>
        <div className="space-y-2 rounded-lg border border-indigo-200/70 bg-white/90 p-3 text-indigo-900 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/50 dark:text-indigo-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-200">
            <span>编码结果</span>
            <button
              type="button"
              onClick={() => handleCopy(encodedResult)}
              className="rounded-full border border-indigo-200/70 px-3 py-1 text-[11px] font-medium text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-500/40 dark:text-indigo-100 dark:hover:bg-indigo-800/60"
            >
              复制
            </button>
          </div>
          <p className="font-mono text-sm break-all">{encodedResult || "暂无结果，请先输入文本并点击编码。"}</p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-sm text-slate-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-100">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-100">Base64 解码为文本</h2>
          <p className="text-xs opacity-80">支持自动忽略空格与换行，并在内容非法时给予提示。</p>
        </header>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-emerald-500 dark:text-emerald-200">Base64 输入</span>
          <textarea
            value={encodedInput}
            onChange={(event) => setEncodedInput(event.target.value)}
            placeholder="请输入合法的 Base64 字符串"
            className="min-h-[120px] rounded-lg border border-emerald-200/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-100"
          />
        </label>
        <button
          type="button"
          onClick={handleDecode}
          className="inline-flex items-center justify-center rounded-lg border border-emerald-200/80 bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 dark:border-emerald-500/50"
        >
          解码为文本
        </button>
        {decodeError && <p className="text-xs text-emerald-900 dark:text-emerald-100">错误：{decodeError}</p>}
        <div className="space-y-2 rounded-lg border border-emerald-200/70 bg-white/90 p-3 text-emerald-900 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-emerald-500 dark:text-emerald-100">
            <span>解码结果</span>
            <button
              type="button"
              onClick={() => handleCopy(decodedResult)}
              className="rounded-full border border-emerald-200/70 px-3 py-1 text-[11px] font-medium text-emerald-600 transition hover:bg-emerald-100 dark:border-emerald-500/40 dark:text-emerald-50 dark:hover:bg-emerald-800/60"
            >
              复制
            </button>
          </div>
          <p className="font-mono text-sm break-words">{decodedResult || "暂无结果，请粘贴 Base64 字符串后点击解码。"}</p>
        </div>
      </section>
    </div>
  );
};

export default Base64ConverterTool;
