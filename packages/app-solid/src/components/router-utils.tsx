import { createContextProvider } from "@solid-primitives/context";
import { createHashHistory } from "history";
import { createEffect, createSignal, onCleanup } from "solid-js";

// create simple wrapper remix history for experimentation purpose
// TODO: compare with solid-router

// expose global history as context signal
const __history = createHashHistory();

const [HistoryProvider, useHistory] = createContextProvider(({}) => {
  const [history, setHistory] = createSignal(__history, {
    equals: () => false,
  });

  createEffect(() => {
    const dispose = __history.listen(() => {
      setHistory(__history);
    });
    onCleanup(() => dispose());
  });

  return history;
}, undefined!);

export { HistoryProvider, useHistory };
