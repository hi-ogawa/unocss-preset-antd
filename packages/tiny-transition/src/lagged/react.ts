import { useEffect, useState, useSyncExternalStore } from "react";
import {
  LaggedBoolean,
  type LaggedBooleanOptions,
  type LaggedBooleanState,
} from "./core";

export function useLaggedBoolean(
  value: boolean,
  options: LaggedBooleanOptions
): LaggedBooleanState {
  const [lagged] = useState(() => new LaggedBoolean(value, options));

  useEffect(() => {
    lagged.set(value);
  }, [value]);

  return useSyncExternalStore(lagged.subscribe, lagged.get, lagged.get);
}
