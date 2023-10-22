import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import { LaggedBoolean, type LaggedBooleanState } from "./core";

export function useLaggedBoolean(
  value: boolean,
  lagDuration: number | { true: number; false: number }
): LaggedBooleanState {
  const [lagged] = useState(
    () =>
      new LaggedBoolean(
        value,
        typeof lagDuration === "number"
          ? { true: lagDuration, false: lagDuration }
          : lagDuration
      )
  );

  useLayoutEffect(() => {
    lagged.set(value);
  }, [value]);

  return useSyncExternalStore(lagged.subscribe, lagged.get, lagged.get);
}
