// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// animation in each direction requires two intemediate states
//   false -(true)-> enterFrom -(next frame)-> enterTo -(timeout)-> true
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
      this.setLagged(value);
    }
  }

  private setLagged(value: boolean) {
    this.disposeTimeout();

    this.state = value ? "enterFrom" : "leaveFrom";
    this.notify();

    // does react guarantee re-rendering after `notify` before `setTimeout(..., 0)`?
    // otherwise, `useLaggedBoolean` might directly see "enterTo" without passing through "enterFrom".
    this.timeoutId = setTimeout(() => {
      this.state = value ? "enterTo" : "leaveTo";
      this.notify();
      this.disposeTimeout();

      this.timeoutId = setTimeout(() => {
        this.state = value;
        this.notify();
        this.disposeTimeout();
      }, this.options.duration);
    }, 0);
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
