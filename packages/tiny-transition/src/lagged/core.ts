// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// TODO: "appear" effect?

// animation in each direction requires two intemediate states
//   false -(true)-> enterFrom -(next frame)-> enterTo -(timeout)-> true
export type LaggedBooleanState =
  | boolean
  | "enterFrom"
  | "enterTo"
  | "leaveFrom"
  | "leaveTo";

export class LaggedBoolean {
  private state: LaggedBooleanState;
  private listeners = new Set<() => void>();
  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  constructor(
    defaultValue: boolean,
    private lagDuration: { true: number; false: number }
  ) {
    this.state = defaultValue;
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
    // if (value) {
    //   if (
    //     this.state === false ||
    //     this.state === "leaveTo" ||
    //     this.state === "leaveFrom"
    //   ) {
    //     this.setLagged(value);
    //   }
    //   // if (
    //   //   this.state === false ||
    //   //   this.state === "leaveTo"
    //   // ) {
    //   //   this.initState(value);
    //   // } else if (this.state === "enterFrom") {
    //   //   this.startTimeout(value);
    //   // } else if (this.state === "leaveFrom") {
    //   //   this.state = value;
    //   // }
    // } else {
    //   if (
    //     this.state === true ||
    //     this.state === "enterFrom" ||
    //     this.state === "enterTo"
    //   ) {
    //     this.setLagged(value);
    //   }
    // }
  }

  // private initState(value: boolean) {
  //   this.disposeTimeout();
  //   this.state = value ? "enterFrom" : "leaveFrom";
  // }

  // private startTimeout(value: boolean) {
  //   this.disposeTimeout();
  //   this.state = value ? "enterTo" : "leaveTo";
  //   this.notify();

  //   this.timeoutId = setTimeout(() => {
  //     this.state = value;
  //     this.notify();
  //     this.disposeTimeout();
  //   }, this.lagDuration[`${value}`]);
  // }

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
      }, this.lagDuration[`${value}`]);
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
