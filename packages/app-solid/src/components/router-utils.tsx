import { createContextProvider } from "@solid-primitives/context";
import { createBrowserHistory } from "history";
import {
  type JSX,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
  untrack,
} from "solid-js";

// create simple wrapper remix history for experimentation purpose
// TODO: compare with solid-router

// expose global history as context signal
const __history = createBrowserHistory();

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

export function Link(props: { to: string } & JSX.HTMLElementTags["a"]) {
  const history = useHistory();
  const href = createMemo(() => untrack(history).createHref(props.to));

  return (
    <a
      href={href()}
      data-active={history().location.pathname === props.to}
      onClick={(e) => {
        e.preventDefault();
        untrack(history).push(props.to);
      }}
      {...splitProps(props, ["to"])[1]}
    >
      {props.children}
    </a>
  );
}
