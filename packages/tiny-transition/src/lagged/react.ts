import { once } from "@hiogawa/utils";
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
  const state = useSyncExternalStore(
    manager.subscribe,
    manager.get,
    manager.get
  );
  // once
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("(before)", manager.get(), value);
  //     manager.set(value);
  //     console.log("(after)", manager.get());
  //   }, 10);
  // });
  // useEffect(() => {
  //   console.log("(before)", { value, state });
  //   manager.set(value);
  //   console.log("(after)", manager.get());
  // }, [value, state]);

  useEffect(
    once(() => {
      console.log("(before)", { value, state });
      manager.set(value);
      console.log("(after)", manager.get());
    }),
    [value, state]
  );

  // useEffect(once(() => {
  //   setTimeout(() => {
  //     console.log("(before)", { value, state });
  //     manager.set(value);
  //     console.log("(after)", manager.get());
  //   }, 10);
  // }), [value, state]);

  return state;
}
