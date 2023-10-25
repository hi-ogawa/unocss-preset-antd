import { tinyassert } from "@hiogawa/utils";

// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// Animation in each direction requires two intemediate steps
// but they are not completely symmetric since "enterFrom -> enterTo" has to wait for element mount.
//   false --(true)----> enterFrom --(mount + next frame)--> enterTo   ---(timeout)-> true
//         <-(timeout)-- leaveTo   <-(next frame)----------- leaveFrom <--(false)----
export type TransitionState =
  | boolean
  | "enterFrom"
  | "enterTo"
  | "leaveFrom"
  | "leaveTo";

export const TRANSITION_CALLBACK_TYPES = [
  "onEnterFrom",
  "onEnterTo",
  "onEntered",
  "onLeaveFrom",
  "onLeaveTo",
  "onLeft",
] as const;

export type TransitionCallbackType = (typeof TRANSITION_CALLBACK_TYPES)[number];

export type TransitionCallbackProps = Partial<
  Record<TransitionCallbackType, (el: HTMLElement) => void>
>;

export class TransitionManager {
  state: TransitionState;
  el: HTMLElement | null = null;
  private listeners = new Set<() => void>();
  private asyncOp = new AsyncOperation();

  constructor(value: boolean, public callbacks?: TransitionCallbackProps) {
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

  private update(state: TransitionState) {
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

//
// utils
//

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

function computeTransitionTimeout(el: HTMLElement): number {
  const style = getComputedStyle(el);
  const [duration, delay] = [
    style.transitionDuration,
    style.transitionDelay,
  ].map((s) => Math.max(...parseDuration(s)));
  return duration + delay;
}

function parseDuration(s: string): number[] {
  // handle multiple transition e.g.
  //   transition: transform 0.1s linear, opacity 1s linear 0.2s;
  return s
    .trim()
    .split(",")
    .map((s) => parseDurationSingle(s.trim()));
}

function parseDurationSingle(s: string): number {
  let ms: number = 0;
  if (!s) {
    ms = 0;
  } else if (s.endsWith("ms")) {
    ms = Number.parseFloat(s.slice(0, -2));
  } else if (s.endsWith("s")) {
    ms = Number.parseFloat(s.slice(0, -1)) * 1000;
  }
  tinyassert(Number.isFinite(ms), `failed to parse css duration '${s}'`);
  return ms;
}

function forceStyle() {
  typeof document.body.offsetHeight || console.log("unreachable");
}
