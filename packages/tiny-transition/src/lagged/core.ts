// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

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
    if (this.state === false && value) {
      this.setLagged(true);
    } else if (this.state === "trueing" && !value) {
      this.setLagged(false);
    } else if (this.state === true && !value) {
      this.setLagged(false);
    } else if (this.state === "falseing" && value) {
      this.setLagged(true);
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
