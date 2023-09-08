import { typedBoolean } from "@hiogawa/utils";
import React from "react";

// based on packages/app-solid/src/components/transition.tsx

// the use case of @headlessui/react is limited to simple usage of `Transition` component
// so here we implement minimal version on own own

// difference from headlessui
// - always wrapped by div
// - always remount
// - no callback (beforeEnter, afterEnter, beforeLeave, afterLeave)
//   - TODO: support
// - no Transition.Child
//   - can workaround by setting same `duraion-xxx` for all components
// - no forward ref

// TODO: test StrictMode (i.e. double effect callback)

interface TransitionClassProps {
  className?: string;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  entered?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

interface TransitionEventProps {
  // TODO
  // beforeEnter?: () => void;
  // afterEnter?: () => void;
  // beforeLeave?: () => void;
  // afterLeave?: () => void;
}

export function Transition2(
  props: {
    show?: boolean;
    appear?: boolean;
    children?: React.ReactNode;
  } & TransitionClassProps &
    TransitionEventProps
) {
  const [manager] = React.useState(
    () =>
      new TransitionManager({
        initiallyEntered: Boolean(props.show && !props.appear),
        ...classPropsToCallbacks(props),
      })
  );

  React.useSyncExternalStore(
    React.useCallback((onStorechange) => manager.subscribe(onStorechange), []),
    () => manager.getSnapshot()
  );

  React.useEffect(() => {
    manager.show(props.show ?? false);
  }, [props.show]);

  return (
    <>
      {manager.shouldRender() && (
        <EffectWrapper
          onLayoutEffect={() => manager.onLayout()}
          onEffect={() => manager.onMount()}
        >
          <div ref={manager.setElement}>{props.children}</div>
        </EffectWrapper>
      )}
    </>
  );
}

function EffectWrapper(props: {
  onEffect: () => void;
  onLayoutEffect: () => void;
  children?: React.ReactNode;
}) {
  React.useLayoutEffect(() => props.onLayoutEffect(), []);
  React.useEffect(() => props.onEffect(), []);
  return <>{props.children}</>;
}

function classPropsToCallbacks(
  props: TransitionClassProps
): TransitionCallbacks {
  const classes = {
    className: splitClass(props.className ?? ""),
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
    },
    onEnterTo: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.enterTo, ...classes.enter);
    },
    onEntered: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.entered);
    },
    onLeaveFrom: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.leaveFrom, ...classes.leave);
    },
    onLeaveTo: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.leaveTo, ...classes.leave);
    },
    onLeft: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className);
    }
  };
}

//
// framework-agnostic animation utility
//

type TransitionState = "left" | "entering" | "entered" | "leaving";

type TransitionCallbacks = {
  onEnterFrom?: (el: HTMLElement) => void;
  onEnterTo?: (el: HTMLElement) => void;
  onEntered?: (el: HTMLElement) => void;
  onLeaveFrom?: (el: HTMLElement) => void;
  onLeaveTo?: (el: HTMLElement) => void;
  onLeft?: (el: HTMLElement) => void;
};

class TransitionManager {
  private listeners = new Set<() => void>();
  private disposables = new Set<() => void>();
  private state: TransitionState = "left";
  private el: HTMLElement | null = null;

  constructor(
    private options: {
      initiallyEntered: boolean;
    } & TransitionCallbacks
  ) {
    this.state = this.options.initiallyEntered ? "entered" : "left";
  }

  shouldRender(): boolean {
    return this.state !== "left";
  }

  show(show: boolean) {
    if (show && this.state !== "entered") {
      this.state = "entering";
      this.notify();
      this.startEnter();
    } else if (!show && this.state !== "left") {
      this.state = "leaving";
      this.notify();
      this.startLeave();
    }
  }

  // api compatible with ref callback
  setElement = (el: HTMLElement | null) => {
    this.dispose();
    this.el = el;
    this.state;
  };

  onLayout() {
    if (!this.el) return;

    // style before paint
    // TODO: in some cases, "appear" works without this. figure out what's the issue.
    if (this.state === "entered") {
      this.options.onEntered?.(this.el);
    } else {
      this.options.onEnterFrom?.(this.el);
    }
  }

  onMount() {
    if (this.state === "entered") return;
    this.startEnter();
  }

  private startEnter() {
    if (!this.el) return;

    const el = this.el;
    this.options.onEnterFrom?.(this.el);
    forceStyle(el);
    this.options.onEnterTo?.(this.el);

    // notify after transition
    this.dispose();
    this.disposables.add(
      onTransitionEnd(el, () => {
        this.state = "entered";
        this.notify(() => this.options.onEnterTo?.(el));
      })
    );
  }

  private startLeave() {
    if (!this.el) return;
    const el = this.el;

    this.options.onLeaveFrom?.(el);
    forceStyle(el);
    this.options.onLeaveTo?.(el);

    // notify after transition
    this.dispose();
    this.disposables.add(
      onTransitionEnd(el, () => {
        this.state = "left";
        this.notify(() => this.options.onLeft?.(el));
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

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot() {
    return this.state;
  }

  private notify(callback?: () => void) {
    if (this.listeners.size === 0) return;
    callback?.();
    this.listeners.forEach((f) => f());
  }
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

function splitClass(c: string): string[] {
  return c.split(" ").filter(typedBoolean);
}

function forceStyle(el: Element) {
  window.getComputedStyle(el).transition ?? console.log("unreachable");
}
