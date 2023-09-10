//
// framework-agnostic animation utility
// (copied from packages/app/src/components/transition.tsx)
//

const TRANSITION_CLASS_TYPES = [
  "class",
  "enter",
  "enterFrom",
  "enterTo",
  "entered",
  "leave",
  "leaveFrom",
  "leaveTo",
] as const;

type TransitionClassType = (typeof TRANSITION_CLASS_TYPES)[number];

export type TransitionClassProps = Partial<Record<TransitionClassType, string>>;

export function processClassProps(
  props: TransitionClassProps & TransitionCallbacks
): TransitionCallbacks {
  // TODO: handle className early for ssr with `show=true appear=false`?
  const classes = {
    className: splitClass(props.class ?? ""),
    enter: splitClass(props.enter ?? ""),
    enterFrom: splitClass(props.enterFrom ?? ""),
    enterTo: splitClass(props.enterTo ?? ""),
    entered: splitClass(props.entered ?? ""),
    leave: splitClass(props.leave ?? ""),
    leaveFrom: splitClass(props.leaveFrom ?? ""),
    leaveTo: splitClass(props.leaveTo ?? ""),
  };
  const all = Object.values(classes).flat();

  // prettier-ignore
  return {
    onEnterFrom: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.enterFrom, ...classes.enter);
      props.onEnterFrom?.(el);
    },
    onEnterTo: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.enterTo, ...classes.enter);
      props.onEnterTo?.(el);
    },
    onEntered: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.enterTo, ...classes.entered);
      props.onEntered?.(el);
    },
    onLeaveFrom: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.leaveFrom, ...classes.leave);
      props.onLeaveFrom?.(el);
    },
    onLeaveTo: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.leaveTo, ...classes.leave);
      props.onLeaveTo?.(el);
    },
    onLeft: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className);
      props.onLeft?.(el);
    }
  };
}

function splitClass(c: string): string[] {
  return c.split(" ").filter(Boolean);
}

type TransitionState = "left" | "entering" | "entered" | "leaving";

const TRANSITION_CALLBACK_TYPES = [
  "onEnterFrom",
  "onEnterTo",
  "onEntered",
  "onLeaveFrom",
  "onLeaveTo",
  "onLeft",
] as const;

type TransitionCallbackType = (typeof TRANSITION_CALLBACK_TYPES)[number];

export type TransitionCallbacks = Partial<
  Record<TransitionCallbackType, (el: HTMLElement) => void>
>;

export class TransitionManager {
  private listeners = new Set<() => void>();
  private disposables = new Set<() => void>();
  private state: TransitionState = "left";
  private el: HTMLElement | null = null;

  constructor(
    public options: {
      initialEntered: boolean;
    } & TransitionCallbacks
  ) {
    this.state = this.options.initialEntered ? "entered" : "left";
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
  el.addEventListener("transitionend", handler);

  // additionally setup `transitionDuration` timeout as a fallback
  const duration = getComputedStyle(el).transitionDuration;
  const durationMs = parseDuration(duration);
  const subscription = window.setTimeout(() => {
    dispose();
    callback();
  }, durationMs);

  function dispose() {
    el.removeEventListener("transitionend", handler);
    window.clearTimeout(subscription);
  }

  return dispose;
}

function parseDuration(s: string): number {
  if (s.endsWith("ms")) {
    return Number(s.slice(0, -2));
  }
  if (s.endsWith("s")) {
    return Number(s.slice(0, -1)) * 1000;
  }
  return 0;
}
