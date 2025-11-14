export interface DateInputState {
  readonly start: string;
  readonly end: string;
}

export interface DateDiffBreakdown {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

export interface DateDiffResult {
  readonly milliseconds: number;
  readonly breakdown: DateDiffBreakdown;
}

export const formatDateTimeLocal = (value: Date): string => {
  const iso = value.toISOString();
  return iso.slice(0, 16);
};

export const createInitialDateState = (): DateInputState => {
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);
  return {
    start: formatDateTimeLocal(now),
    end: formatDateTimeLocal(later)
  };
};

export const computeDateDiff = (state: DateInputState): DateDiffResult | null => {
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
