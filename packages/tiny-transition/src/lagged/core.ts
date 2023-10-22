// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// animation in each direction requires two intemediate steps
//   false --(true)----> enterFrom --(true)--> enterTo   ---(timeout)-> true
//         <-(timeout)-- leaveTo   <-(false)-- leaveFrom <--(false)----
export type LaggedBooleanState =
  | boolean
  | "enterFrom"
  | "enterTo"
  | "leaveFrom"
  | "leaveTo";

export interface LaggedBooleanOptions {
  duration: number;
  appear?: boolean;
}

export class LaggedBoolean {
  private state: LaggedBooleanState;
  private listeners = new Set<() => void>();
  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  constructor(value: boolean, private options: LaggedBooleanOptions) {
    this.state = options?.appear ? !value : value;
  }

  get = () => this.state;

  set(value: boolean) {
    if (
      value
        ? this.state === false ||
          this.state === "leaveTo" ||
          this.state === "leaveFrom"
        : this.state === true ||
          this.state === "enterFrom" ||
          this.state === "enterTo"
    ) {
      this.startFrom(value);
    } else if (this.state === "enterFrom" || this.state === "leaveFrom") {
      setTimeout(() => {
        this.startTo(value);
      }, 0);
    }
  }

  private startFrom(value: boolean) {
    this.disposeTimeout();
    this.state = value ? "enterFrom" : "leaveFrom";
    this.notify();
  }

  private startTo(value: boolean) {
    this.disposeTimeout();
    this.state = value ? "enterTo" : "leaveTo";
    this.notify();

    this.timeoutId = setTimeout(() => {
      this.state = value;
      this.notify();
      this.disposeTimeout();
    }, this.options.duration);
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private disposeTimeout() {
    if (typeof this.timeoutId !== "undefined") {
      clearTimeout(this.timeoutId);
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
