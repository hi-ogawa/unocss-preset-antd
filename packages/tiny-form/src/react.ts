import React from "react";
import { type TinyFormHelper, createTinyForm } from "./core";

export function useTinyForm<T extends {}>(
  defaultValue: T | (() => T)
): TinyFormHelper<T> {
  const stateHook = React.useState(defaultValue);
  const form = React.useMemo(() => createTinyForm(stateHook), stateHook);
  return form;
}
