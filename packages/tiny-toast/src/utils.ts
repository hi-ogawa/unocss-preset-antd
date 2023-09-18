type PauseableTimeoutState =
  | {
      t: "stopped";
    }
  | {
      t: "started";
      startedAt: number;
      stop: () => void;
    }
  | {
      t: "disposed";
    };

export class PauseableTimeout {
  public state: PauseableTimeoutState = { t: "stopped" };
  public runningMs = 0;

  // TODO: handle ms === Infinity
  constructor(private callback: () => void, private ms: number) {}

  start() {
    if (this.state.t === "stopped") {
      this.state = {
        t: "started",
        startedAt: Date.now(),
        stop: setupTimeout(() => {
          this.state = { t: "disposed" };
          this.callback();
          this.notify();
        }, this.ms - this.runningMs),
      };
      this.notify();
    }
  }

  stop() {
    if (this.state.t === "started") {
      this.state.stop();
      this.runningMs += Date.now() - this.state.startedAt;
      this.state = { t: "stopped" };
      this.notify();
    }
  }

  dispose() {
    if (this.state.t === "started") {
      this.state.stop();
    }
    this.state = { t: "disposed" };
    this.notify();
  }

  // external store api
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  notify() {
    this.listeners.forEach((f) => f());
  }
}

// pause-able setTimeout
export function createPauseableTimeout(
  callback: () => void,
  ms: number
  // options?: { onDisposed?: () => void }
) {
  // TODO: handle ms === Infinity

  type State =
    | {
        t: "stopped";
      }
    | {
        t: "started";
        startedAt: number;
        stop: () => void;
      }
    | {
        t: "disposed";
      };

  let state: State = { t: "stopped" };
  let runningMs = 0;

  function callbackWrapper() {
    state = { t: "disposed" };
    callback();
    // options?.onDisposed?.();
  }

  return {
    start: () => {
      if (state.t === "stopped") {
        state = {
          t: "started",
          startedAt: Date.now(),
          stop: setupTimeout(callbackWrapper, ms - runningMs),
        };
      }
    },
    stop: () => {
      if (state.t === "started") {
        state.stop();
        runningMs += Date.now() - state.startedAt;
        state = { t: "stopped" };
      }
    },
    dispose: () => {
      if (state.t === "started") {
        state.stop();
      }
      state = { t: "disposed" };
      // options?.onDisposed?.();
    },
    state: () => state,
  };
}

// destroy callback style api
function setupTimeout(f: () => void, ms: number) {
  let handle = setTimeout(f, ms);
  return () => {
    clearTimeout(handle);
  };
}

// cheap random id
export function generateId() {
  // prettier-ignore
  return Math.floor(Math.random() * 2 ** 50).toString(32).padStart(10, "0");
}

export function cls(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}
