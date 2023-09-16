import React from "react";
import { type TinyFormHelper, createTinyForm } from "./core";

type ReactTinyFormHelper<T> = TinyFormHelper<T> & {
  isDirty: boolean;
  resetDirty: () => void;
};

type UseDirtyOptions<T> = {
  isEqual?: (x: T, y: T) => boolean;
};

export function useTinyForm<T extends {}>(
  defaultValue: T | (() => T),
  options?: UseDirtyOptions<T>
): ReactTinyFormHelper<T> {
  const stateHook = React.useState(defaultValue);
  const form = React.useMemo(() => createTinyForm(stateHook), stateHook);
  const [isDirty, resetDirty] = useDirty(stateHook[0], options);
  return {
    ...form,
    isDirty,
    resetDirty,
  };
}

// can we move this logic to core?
function useDirty<T>(data: T, options?: UseDirtyOptions<T>) {
  const [freshData, setFreshData] = React.useState(() => data);

  const isDirty = React.useMemo(
    () => !(options?.isEqual ?? defaultIsEqual)(data, freshData),
    [data, freshData]
  );

  // we could accept `newFreshData` argument
  function resetDirty() {
    setFreshData(data);
  }

  return [isDirty, resetDirty] as const;
}

function defaultIsEqual<T>(x: T, y: T) {
  return JSON.stringify(x) === JSON.stringify(y);
}
