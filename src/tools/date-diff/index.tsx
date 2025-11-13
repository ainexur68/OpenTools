import React, { useMemo, useState } from "react";
import toolMeta, { toolId } from "./config";

type DateInputState = {
  readonly start: string;
  readonly end: string;
};

type DateDiffResult = {
  readonly milliseconds: number;
  readonly breakdown: {
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
  };
};

const formatDateTimeLocal = (value: Date): string => {
  const iso = value.toISOString();
  return iso.slice(0, 16);
};

const getInitialState = (): DateInputState => {
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);
  return {
    start: formatDateTimeLocal(now),
    end: formatDateTimeLocal(later)
  };
};

const computeDiff = (state: DateInputState): DateDiffResult | null => {
  const start = state.start ? new Date(state.start) : null;
  const end = state.end ? new Date(state.end) : null;

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const milliseconds = end.getTime() - start.getTime();
  const absolute = Math.abs(milliseconds);

  const days = Math.floor(absolute / (24 * 60 * 60 * 1000));
  const hours = Math.floor((absolute % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((absolute % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((absolute % (60 * 1000)) / 1000);

  return {
    milliseconds,
    breakdown: { days, hours, minutes, seconds }
  };
};

export { toolId, toolMeta };

export const DateDiffTool: React.FC = () => {
  const [state, setState] = useState<DateInputState>(getInitialState);
  const diff = useMemo(() => computeDiff(state), [state]);

  const signLabel = diff && diff.milliseconds < 0 ? "结束时间早于开始时间" : "开始时间早于结束时间";

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{toolMeta.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{toolMeta.description}</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">开始时间</span>
            <input
              className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
              type="datetime-local"
              value={state.start}
              onChange={(event) => setState((prev) => ({ ...prev, start: event.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">结束时间</span>
            <input
              className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-indigo-400"
              type="datetime-local"
              value={state.end}
              onChange={(event) => setState((prev) => ({ ...prev, end: event.target.value }))}
            />
          </label>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {diff ? signLabel : "请输入有效的开始与结束时间。"}
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-4 text-sm text-slate-700 shadow-sm dark:border-indigo-500/50 dark:bg-indigo-950/40 dark:text-indigo-100">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">差值详情</h2>
          <p className="text-xs opacity-80">支持复制任意结果字段。</p>
        </header>
        {diff ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">总毫秒数</dt>
              <dd className="font-mono text-base">{diff.milliseconds}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">总秒数</dt>
              <dd className="font-mono text-base">{Math.round(diff.milliseconds / 1000)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">天</dt>
              <dd className="font-mono text-lg">{diff.breakdown.days}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">小时</dt>
              <dd className="font-mono text-lg">{diff.breakdown.hours}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">分钟</dt>
              <dd className="font-mono text-lg">{diff.breakdown.minutes}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">秒</dt>
              <dd className="font-mono text-lg">{diff.breakdown.seconds}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-xs">尚未计算出结果，请先填写有效的时间范围。</p>
        )}
      </section>
    </div>
  );
};

export default DateDiffTool;
