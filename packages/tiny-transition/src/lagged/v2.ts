import { computeTransitionTimeout } from "../core";
import { AsyncOperation, type LaggedBooleanState, forceStyle } from "./core";

export class TransitionManagerV2 {
  state: LaggedBooleanState;
  private el: HTMLElement | null = null;
  private listeners = new Set<() => void>();
  private asyncOp = new AsyncOperation();

  constructor(value: boolean, options?: { appear?: boolean }) {
    this.state = options?.appear ? !value : value;
  }

  set(value: boolean) {
    const isTruthy =
      this.state === true ||
      this.state === "enterFrom" ||
      this.state === "enterTo";
    if (value !== isTruthy) {
      this.startTransition(value);
    }
  }

  ref = (el: HTMLElement | null) => {
    this.el = el;
    if (el) {
      if (this.state === "enterFrom") {
        this.startTransition(true);
      }
    } else {
      this.state = false;
    }
  };

  private startTransition(value: boolean) {
    this.asyncOp.dispose();

    this.update(value ? "enterFrom" : "leaveFrom");

    // delay "enterTo" transition until mount
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

  private update(state: LaggedBooleanState) {
    if (this.state === state) {
      return;
    }
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
