// inspired by discussions in solid `createPresense`
// https://github.com/solidjs-community/solid-primitives/pull/414#issuecomment-1520787178
// https://github.com/solidjs-community/solid-primitives/pull/437

// animation in each direction requires two intemediate steps
//   false --(true)----> enterFrom --(mount + next frame)--> enterTo   ---(timeout)-> true
//         <-(timeout)-- leaveTo   <-(next frame)----------- leaveFrom <--(false)----
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
  private asyncOp = new AsyncOperation();

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
    this.asyncOp.dispose();

    this.state = value ? "enterFrom" : "leaveFrom";
    this.notify();

    // does react scheduling guarantee re-rendering between two `notify` separated by `requestAnimationFrame`?
    // if that's not the case, `useLaggedBoolean` might directly see "enterTo" without passing through "enterFrom".
    this.asyncOp.requestAnimationFrame(() => {
      forceStyle(); // `appear` doesn't work reliably without this?
      this.state = value ? "enterTo" : "leaveTo";
      this.notify();

      this.asyncOp.setTimeout(() => {
        this.state = value;
        this.notify();
      }, this.options.duration);
    });
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

export class AsyncOperation {
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

export function forceStyle() {
  typeof document.body.offsetHeight || console.log("unreachable");
}
