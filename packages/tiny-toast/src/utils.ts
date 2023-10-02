import type * as CSS from "csstype";

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

  constructor(private callback: () => void, public ms: number) {}

  start() {
    if (this.state.t === "stopped") {
      this.state = {
        t: "started",
        startedAt: Date.now(),
        stop: setupTimeout(() => {
          this.state = { t: "disposed" };
          this.callback();
        }, this.ms - this.runningMs),
      };
    }
  }

  stop() {
    if (this.state.t === "started") {
      this.state.stop();
      this.runningMs += Date.now() - this.state.startedAt;
      this.state = { t: "stopped" };
    }
  }

  dispose() {
    if (this.state.t === "started") {
      this.state.stop();
    }
    this.state = { t: "disposed" };
  }
}

// destroy callback style api + handle Infinity
function setupTimeout(f: () => void, ms: number) {
  if (ms === Infinity) {
    return () => {};
  }
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

// type-safe styles assignment
export const styleAssign = Object.assign<
  Partial<CSSStyleDeclaration>,
  Partial<CSSStyleDeclaration>
>;

// type-safe inline style util based on csstype
// cf. https://github.com/cristianbote/goober/blob/a849b2d644146d96fa1dd1c560f6418ee1e1c469/src/core/parse.js#L48
export function istyle(props: CSS.Properties): string {
  return Object.entries(props)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, "-$&").toLowerCase()}:${v};`)
    .join("");
}
