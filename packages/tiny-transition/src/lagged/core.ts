// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// this is not enough to achieve
//   left -(true)-> enterFrom -(next frame)-> enterTo -(timeout)-> entered

export type LaggedBooleanState = boolean | "trueing" | "falseing";

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
    if (value && (this.state === false || this.state === "falseing")) {
      this.setLagged(true);
    }
    if (!value && (this.state === true || this.state === "trueing")) {
      this.setLagged(false);
    }
  }

  private setLagged(value: boolean) {
    if (typeof this.timeoutId !== "undefined") {
      clearTimeout(this.timeoutId);
    }

    this.state = `${value}ing`;
    this.notify();

    this.timeoutId = setTimeout(() => {
      this.state = value;
      this.notify();
    }, this.lagDuration[`${value}`]);
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
