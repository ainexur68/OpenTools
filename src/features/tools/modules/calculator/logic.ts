export interface CalculatorState {
  readonly first: string;
  readonly second: string;
}

export interface CalculatorResult {
  readonly sum: number;
  readonly difference: number;
  readonly product: number;
  readonly quotient: number | null;
  readonly remainder: number | null;
  readonly power: number | null;
}

export const initialCalculatorState: CalculatorState = {
  first: "",
  second: ""
};

export const parseNumericInput = (value: string): number | null => {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const computeCalculatorResults = (
  state: CalculatorState
): CalculatorResult | null => {
  const first = parseNumericInput(state.first);
  const second = parseNumericInput(state.second);

  if (first === null || second === null) {
    return null;
  }

  const quotient = second === 0 ? null : first / second;

  return {
    sum: first + second,
    difference: first - second,
    product: first * second,
    quotient,
    remainder: second === 0 ? null : first % second,
    power: first === 0 && second === 0 ? null : Math.pow(first, second)
  };
};

export const formatNumericResult = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "结果超出可表示范围";
  }

  return value.toString();
};
