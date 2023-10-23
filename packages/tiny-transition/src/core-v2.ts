import { computeTransitionTimeout } from "./core";

// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// Animation in each direction requires two intemediate steps
// but they are not completely symmetric since "enterTo" has to wait element mount.
//   false --(true)----> enterFrom --(mount + next frame)--> enterTo   ---(timeout)-> true
//         <-(timeout)-- leaveTo   <-(next frame)----------- leaveFrom <--(false)----
export type TransitionState =
  | boolean
  | "enterFrom"
  | "enterTo"
  | "leaveFrom"
  | "leaveTo";

export class TransitionManagerV2 {
  state: TransitionState;
  private el: HTMLElement | null = null;
  private listeners = new Set<() => void>();
  private asyncOp = new AsyncOperation();

  constructor(value: boolean, options?: { appear?: boolean }) {
    this.state = options?.appear ? !value : value;
  }

  set = (value: boolean) => {
    const isTruthy =
      this.state === true ||
      this.state === "enterFrom" ||
      this.state === "enterTo";
    if (value !== isTruthy) {
      this.startTransition(value);
    }
  };

  ref = (el: HTMLElement | null) => {
    this.el = el;
    if (el && this.state === "enterFrom") {
      // listener for "enterFrom" will be called twice before and after mounted,
      // which is critical for `Transition` component callbacks to work.
      this.startTransition(true);
    }
    if (!el) {
      this.state = false;
    }
  };

  private startTransition(value: boolean) {
    this.asyncOp.dispose();

    this.update(value ? "enterFrom" : "leaveFrom");

    // delay "enterTo" transition until mountq
    if (!this.el) {
      return;
    }

    const duration = computeTransitionTimeout(this.el);

    this.asyncOp.requestAnimationFrame(() => {
      forceStyle(); // `appear` breaks without this. not entirely sure why.
      this.update(value ? "enterTo" : "leaveTo");

      this.asyncOp.setTimeout(() => {
        this.update(value);
      }, duration);
    });
  }

  private update(state: TransitionState) {
    this.state = state;
    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

class AsyncOperation {
  private disposables = new Set<() => void>();

  setTimeout(callback: () => void, ms: number) {
    const id = setTimeout(callback, ms);
    this.disposables.add(() => clearTimeout(id));
  }

  requestAnimationFrame(callback: () => void) {
    const id = requestAnimationFrame(callback);
    this.disposables.add(() => cancelAnimationFrame(id));
  }

  dispose() {
    this.disposables.forEach((f) => f());
    this.disposables.clear();
  }
}

function forceStyle() {
  typeof document.body.offsetHeight || console.log("unreachable");
}
