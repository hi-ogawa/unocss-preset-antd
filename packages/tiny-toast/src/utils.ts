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
  let totalMs = 0;

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
          stop: setupTimeout(callbackWrapper, ms - totalMs),
        };
      }
    },
    stop: () => {
      if (state.t === "started") {
        state.stop();
        totalMs += Date.now() - state.startedAt;
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
