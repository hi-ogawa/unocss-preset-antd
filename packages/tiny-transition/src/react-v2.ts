import { useEffect, useState, useSyncExternalStore } from "react";
import { TransitionManagerV2 } from "./core-v2";

export function useTransitionManagerV2(
  value: boolean,
  options?: { appear?: boolean }
) {
  const [manager] = useState(() => new TransitionManagerV2(value, options));

  useEffect(() => {
    manager.set(value);
  }, [value]);

  useSyncExternalStore(
    manager.subscribe,
    () => manager.state,
    () => manager.state
  );

  return manager;
}
