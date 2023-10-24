import { type TransitionCallbackProps, computeTransitionTimeout } from "./core";

// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// Animation in each direction requires two intemediate steps
// but they are not completely symmetric since "enterFrom -> enterTo" has to wait for element mount.
//   false --(true)----> enterFrom --(mount + next frame)--> enterTo   ---(timeout)-> true
//         <-(timeout)-- leaveTo   <-(next frame)----------- leaveFrom <--(false)----
export type TransitionStateV2 =
  | boolean
  | "enterFrom"
  | "enterTo"
  | "leaveFrom"
  | "leaveTo";

export class TransitionManagerV2 {
  state: TransitionStateV2;
  private el: HTMLElement | null = null;
  private listeners = new Set<() => void>();
  private asyncOp = new AsyncOperation();

  constructor(value: boolean, private callbacks?: TransitionCallbackProps) {
    this.state = value;
  }

  set = (value: boolean) => {
    const current =
      this.state === true ||
      this.state === "enterFrom" ||
      this.state === "enterTo";
    if (value && !current) {
      if (!this.el) {
        this.update("enterFrom");
      } else {
        this.startTransition(true);
      }
    }
    if (!value && current) {
      this.startTransition(false);
    }
  };

  ref = (el: HTMLElement | null) => {
    this.el = el;
    if (el && this.state === "enterFrom") {
      // notify "enterFrom" again after mounted
      this.startTransition(true);
    }
    if (!el) {
      this.state = false;
    }
  };

  private startTransition(value: boolean) {
    if (!this.el) return;

    this.asyncOp.reset();
    this.update(value ? "enterFrom" : "leaveFrom");

    this.asyncOp.requestAnimationFrame(() => {
      if (!this.el) return;

      forceStyle(); // `appear` breaks without this. not entirely sure why.
      this.update(value ? "enterTo" : "leaveTo");

      const duration = computeTransitionTimeout(this.el);
      this.asyncOp.setTimeout(() => {
        this.update(value);
      }, duration);
    });
  }

  private update(state: TransitionStateV2) {
    this.state = state;
    if (this.listeners.size > 0 && this.el) {
      if (state === false) this.callbacks?.onLeft?.(this.el);
      if (state === "enterFrom") this.callbacks?.onEnterFrom?.(this.el);
      if (state === "enterTo") this.callbacks?.onEnterTo?.(this.el);
      if (state === true) this.callbacks?.onEntered?.(this.el);
      if (state === "leaveFrom") this.callbacks?.onLeaveFrom?.(this.el);
      if (state === "leaveTo") this.callbacks?.onLeaveTo?.(this.el);
    }
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

  reset() {
    this.disposables.forEach((f) => f());
    this.disposables.clear();
  }
}

function forceStyle() {
  typeof document.body.offsetHeight || console.log("unreachable");
}
