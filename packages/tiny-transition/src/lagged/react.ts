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
  const [manager] = useState(() => new LaggedBoolean(value, options));

  useEffect(() => {
    manager.set(value);
  }, [value]);

  return useSyncExternalStore(manager.subscribe, manager.get, manager.get);
}
