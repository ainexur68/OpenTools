import React, { useState } from "react";
import toolMeta, { toolId } from "./meta";
import { decodeUrlText, encodeUrlText, sampleUrlData, type UrlEncodeMode } from "./logic";

export { toolId, toolMeta };

const encodeModes: readonly { id: UrlEncodeMode; label: string; hint: string }[] = [
  { id: "component", label: "encodeURIComponent", hint: "适合 query 参数 / 路由片段" },
  { id: "uri", label: "encodeURI", hint: "适合整条 URL，保留协议与斜杠" }
] as const;

export const UrlEncoderTool: React.FC = () => {
  const [encodeInput, setEncodeInput] = useState<string>(sampleUrlData.plain);
  const [encodeMode, setEncodeMode] = useState<UrlEncodeMode>("component");
  const [encodeSpaceAsPlus, setEncodeSpaceAsPlus] = useState(true);
  const [encodedResult, setEncodedResult] = useState(() =>
    encodeUrlText(sampleUrlData.plain, { mode: "component", encodeSpaceAsPlus: true })
  );

  const [decodeInput, setDecodeInput] = useState<string>(sampleUrlData.encoded);
  const [treatPlusAsSpace, setTreatPlusAsSpace] = useState(true);
  const [decodedResult, setDecodedResult] = useState(() => {
    try {
      return decodeUrlText(sampleUrlData.encoded, { treatPlusAsSpace: true });
    } catch {
      return "";
    }
  });
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const handleEncode = () => {
    const result = encodeUrlText(encodeInput, { mode: encodeMode, encodeSpaceAsPlus });
    setEncodedResult(result);
  };

  const handleDecode = () => {
    try {
      const result = decodeUrlText(decodeInput, { treatPlusAsSpace });
      setDecodedResult(result);
      setDecodeError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "无法解码 URL。";
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
          针对 URL 参数与完整链接提供独立模式，同时支持 <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">+</code> 空格兼容，适合表单提交场景。
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-sky-200/80 bg-sky-50/70 p-4 text-sm text-slate-700 shadow-sm dark:border-sky-500/40 dark:bg-sky-950/30 dark:text-sky-100">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold text-sky-700 dark:text-sky-100">文本编码为 URL</h2>
          <p className="text-xs opacity-80">选择编码模式，输入文本后点击按钮即可生成安全的 URL 片段。</p>
        </header>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-sky-500 dark:text-sky-200">输入文本 / URL 片段</span>
          <textarea
            value={encodeInput}
            onChange={(event) => setEncodeInput(event.target.value)}
            placeholder="例如 keyword=OpenTools: URL & Base64!"
            className="min-h-[120px] rounded-lg border border-sky-200/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-sky-500/50 dark:bg-sky-950/40 dark:text-sky-100"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium uppercase tracking-wide text-sky-500 dark:text-sky-200">编码模式</span>
            <select
              value={encodeMode}
              onChange={(event) => setEncodeMode(event.target.value as UrlEncodeMode)}
              className="rounded-lg border border-sky-200/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-sky-500/50 dark:bg-sky-900/40 dark:text-sky-100"
            >
              {encodeModes.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.label}（{mode.hint}）
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-sky-200/60 bg-white/70 px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-slate-200">
            <input
              type="checkbox"
              checked={encodeSpaceAsPlus}
              onChange={(event) => setEncodeSpaceAsPlus(event.target.checked)}
              className="h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
            />
            <span>将空格编码为 +（表单兼容）</span>
          </label>
        </div>
        <button
          type="button"
          onClick={handleEncode}
          className="inline-flex items-center justify-center rounded-lg border border-sky-200/80 bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 dark:border-sky-500/50"
        >
          编码 URL
        </button>
        <div className="space-y-2 rounded-lg border border-sky-200/70 bg-white/90 p-3 text-sky-900 shadow-sm dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-sky-500 dark:text-sky-100">
            <span>编码结果</span>
            <button
              type="button"
              onClick={() => handleCopy(encodedResult)}
              className="rounded-full border border-sky-200/70 px-3 py-1 text-[11px] font-medium text-sky-600 transition hover:bg-sky-100 dark:border-sky-500/40 dark:text-sky-50 dark:hover:bg-sky-800/60"
            >
              复制
            </button>
          </div>
          <p className="font-mono text-sm break-all">{encodedResult || "暂无结果，请输入文本后点击编码。"}</p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm text-slate-700 shadow-sm dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold text-amber-700 dark:text-amber-100">URL 解码为文本</h2>
          <p className="text-xs opacity-80">自动处理 %xx 序列，可选将 <code className="rounded bg-amber-100 px-1 py-0.5 text-[10px]">+</code> 视为空格。</p>
        </header>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-amber-500 dark:text-amber-200">URL 输入</span>
          <textarea
            value={decodeInput}
            onChange={(event) => setDecodeInput(event.target.value)}
            placeholder="例如 keyword=OpenTools%3A+URL+%26+Base64%21"
            className="min-h-[120px] rounded-lg border border-amber-200/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-100"
          />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-amber-200/60 bg-white/80 px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-100">
          <input
            type="checkbox"
            checked={treatPlusAsSpace}
            onChange={(event) => setTreatPlusAsSpace(event.target.checked)}
            className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
          />
          <span>将 + 视为空格（application/x-www-form-urlencoded）</span>
        </label>
        <button
          type="button"
          onClick={handleDecode}
          className="inline-flex items-center justify-center rounded-lg border border-amber-200/90 bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-400 dark:border-amber-500/50"
        >
          解码 URL
        </button>
        {decodeError && <p className="text-xs text-amber-900 dark:text-amber-100">错误：{decodeError}</p>}
        <div className="space-y-2 rounded-lg border border-amber-200/70 bg-white/90 p-3 text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-amber-500 dark:text-amber-100">
            <span>解码结果</span>
            <button
              type="button"
              onClick={() => handleCopy(decodedResult)}
              className="rounded-full border border-amber-200/70 px-3 py-1 text-[11px] font-medium text-amber-600 transition hover:bg-amber-100 dark:border-amber-500/40 dark:text-amber-50 dark:hover:bg-amber-800/60"
            >
              复制
            </button>
          </div>
          <p className="font-mono text-sm break-words">{decodedResult || "暂无结果，请粘贴 URL 后点击解码。"}</p>
        </div>
      </section>
    </div>
  );
};

export default UrlEncoderTool;
