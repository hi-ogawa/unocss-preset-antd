import { tinyassert } from "@hiogawa/utils";

//
// callback type
//

export const TRANSITION_CALLBACK_TYPES = [
  "onEnterFrom",
  "onEnterTo",
  "onEntered",
  "onLeaveFrom",
  "onLeaveTo",
  "onLeft",
] as const;

export type TransitionCallbackType = (typeof TRANSITION_CALLBACK_TYPES)[number];

export type TransitionCallbackProps = Partial<
  Record<TransitionCallbackType, (el: HTMLElement) => void>
>;

//
// manager
//

export type TransitionState = "left" | "entering" | "entered" | "leaving";

export class TransitionManager {
  private listeners = new Set<() => void>();
  private disposables = new Set<() => void>();
  private state: TransitionState = "left";
  private el: HTMLElement | null = null;

  constructor(
    public options: {
      defaultEntered: boolean;
    } & TransitionCallbackProps
  ) {
    this.state = this.options.defaultEntered ? "entered" : "left";
  }

  shouldRender(): boolean {
    return this.state !== "left";
  }

  show(show: boolean) {
    if (show && this.state !== "entering" && this.state !== "entered") {
      this.state = "entering";
      // `startEnter` is usually handled in `onLayout` since `this.el` is null for normal cases.
      // however `this.el` can be non-null when `show` flips (true -> false -> true) faster than transition animation.
      this.startEnter();
      this.notify();
    }
    if (!show && this.state !== "leaving" && this.state !== "left") {
      this.state = "leaving";
      this.startLeave();
      this.notify();
    }
  }

  // api compatible with ref callback
  setElement = (el: HTMLElement | null) => {
    this.dispose();
    this.el = el;
    if (!el) return;
    if (this.state === "entered") {
      this.options.onEntered?.(el);
    } else if (this.state === "entering") {
      this.startEnter();
    }
  };

  private startEnter() {
    if (!this.el) return;
    const el = this.el;

    // "enterFrom"
    this.options.onEnterFrom?.(el);

    this.dispose();
    this.disposables.add(
      onNextFrame(() => {
        // "enterTo" on next frame
        this.options.onEnterTo?.(el);

        // notify "entered"
        this.disposables.add(
          onTransitionEnd(el, () => {
            this.state = "entered";
            this.notify(() => this.options.onEntered?.(el));
          })
        );
      })
    );
  }

  private startLeave() {
    if (!this.el) return;
    const el = this.el;

    // "leaveFrom"
    this.options.onLeaveFrom?.(el);

    this.dispose();
    this.disposables.add(
      onNextFrame(() => {
        // "leaveTo" on next frame
        this.options.onLeaveTo?.(el);

        // notify "left"
        this.disposables.add(
          onTransitionEnd(el, () => {
            this.state = "left";
            this.notify(() => this.options.onLeft?.(el));
          })
        );
      })
    );
  }

  private dispose() {
    this.disposables.forEach((f) => f());
    this.disposables.clear();
  }

  //
  // api for React.useSyncExternalStore
  //

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  private notify(callback?: () => void) {
    if (this.listeners.size === 0) return;
    callback?.();
    this.listeners.forEach((f) => f());
  }
}

function onNextFrame(callback: () => void) {
  const id = window.requestAnimationFrame(callback);
  return () => {
    window.cancelAnimationFrame(id);
  };
}

function onTransitionEnd(el: HTMLElement, callback: () => void) {
  // listen "transitionend"
  const handler = (e: HTMLElementEventMap["transitionend"]) => {
    if (e.target === e.currentTarget) {
      dispose();
      callback();
    }
  };
  // TODO: this doesn't work for multiple transition
  // el.addEventListener("transitionend", handler);

  // additionally setup `transitionDuration` timeout as a fallback
  const subscription = window.setTimeout(() => {
    dispose();
    callback();
  }, computeTransitionTimeout(el));

  function dispose() {
    el.removeEventListener("transitionend", handler);
    window.clearTimeout(subscription);
  }

  return dispose;
}

function computeTransitionTimeout(el: HTMLElement): number {
  const style = getComputedStyle(el);
  const [duration, delay] = [
    style.transitionDuration,
    style.transitionDelay,
  ].map((s) => Math.max(...parseDuration(s)));
  return duration + delay;
}

function parseDuration(s: string): number[] {
  // handle multiple transition e.g.
  //   transition: width 0.1s ease-out, opacity 0.5s ease 0.2s;
  return s
    .trim()
    .split(",")
    .map((s) => parseDurationSingle(s.trim()));
}

function parseDurationSingle(s: string): number {
  let ms: number = 0;
  if (!s) {
    ms = 0;
  } else if (s.endsWith("ms")) {
    ms = Number.parseFloat(s.slice(0, -2));
  } else if (s.endsWith("s")) {
    ms = Number.parseFloat(s.slice(0, -1)) * 1000;
  }
  tinyassert(Number.isFinite(ms), `Failed to parse css duration '${s}'`);
  return ms;
}
