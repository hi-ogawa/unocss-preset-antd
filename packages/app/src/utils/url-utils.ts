import { useSearchParams } from "react-router-dom";

type NextState<T> = T | ((prev: T) => T);

type SetState<T> = (next: NextState<T>) => void;

function resolveNext<T>(prev: () => T, next: NextState<T>): T {
  return typeof next === "function" ? (next as any)(() => prev) : prev;
}

// simple state helper for string-key-value on URLSearchParams
export function useUrlQuery<T extends Record<string, string>>(defaultValue: T) {
  const [params, setParams] = useSearchParams(defaultValue);

  const state = Object.fromEntries(params.entries()) as T;

  const setState: SetState<T> = (next) => {
    setParams(new URLSearchParams(resolveNext(() => state, next)));
  };

  return [state, setState] as const;
}
