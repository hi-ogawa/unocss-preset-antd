import { typedBoolean } from "@hiogawa/utils";
import React from "react";

// based on packages/app-solid/src/components/transition.tsx

// the use case of @headlessui/react is limited to simple usage of `Transition` component
// so here we implement minimal version on own own

// difference from headlessui
// - always wrapped by div
// - always remount
// - always appear = true
//   - TODO: support
// - no callback (beforeEnter, afterEnter, beforeLeave, afterLeave)
//   - TODO: support
// - no Transition.Child
//   - can workaround by setting same `duraion-xxx` for all components
// - no forward ref

// TODO: test StrictMode (i.e. double effect callback)

// TODO: eventual consistency when "show" flips faster than animation?

interface TransitionClassProps {
  className?: string;
  enterFrom?: string;
  enterTo?: string;
  // TODO
  // enter?: string;
  // entered?: string;
  // leave?: string;
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
        entered: Boolean(props.show && !props.appear),
        classes: {
          // TODO: reactive props
          className: splitClass(props.className ?? ""),
          enterFrom: splitClass(props.enterFrom ?? ""),
          enterTo: splitClass(props.enterTo ?? ""),
          leaveFrom: splitClass(props.leaveFrom ?? ""),
          leaveTo: splitClass(props.leaveTo ?? ""),
        },
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

//
// framework-agnostic animation utility
//

type TransitionState = "left" | "entering" | "entered";

class TransitionManager {
  private listeners = new Set<() => void>();
  private disposables = new Set<() => void>();
  private state: TransitionState = "left";
  private el: HTMLElement | null = null;

  constructor(
    private options: {
      entered: boolean;
      // TODO: manager itself doesn't have to be aware of classes?
      //       just support style manipulation via beforeEnter/afterEnter/beforeLeave/afterLeave callbacks?
      classes: {
        className: string[];
        enterFrom: string[];
        enterTo: string[];
        leaveFrom: string[];
        leaveTo: string[];
      };
    }
  ) {
    this.state = this.options.entered ? "entered" : "left";
  }

  shouldRender(): boolean {
    return this.state !== "left";
  }

  show(show: boolean) {
    if (show && !this.shouldRender()) {
      this.state = "entering";
      this.notify();
    }
    if (!show && this.shouldRender()) {
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

    const el = this.el;
    const classes = this.options.classes;

    // style before paint
    if (this.state === "entered") {
      el.classList.remove(...Object.values(classes).flat());
      el.classList.add(...classes.className, ...classes.enterTo);
    } else {
      // TODO: in some cases, "appear" works without this, so not entirely sure why.
      el.classList.remove(...Object.values(classes).flat());
      el.classList.add(...classes.className, ...classes.enterFrom);
    }
  }

  onMount() {
    if (!this.el) return;
    if (this.state === "entered") return;

    this.dispose();
    const el = this.el;
    const classes = this.options.classes;

    // enterFrom
    el.classList.remove(...Object.values(classes).flat());
    el.classList.add(...classes.className, ...classes.enterFrom);
    forceStyle(el);

    // enterFrom => enterTo
    el.classList.remove(...classes.enterFrom);
    el.classList.add(...classes.enterTo);

    // notify after transition
    this.disposables.add(
      onTransitionEnd(el, () => {
        this.state = "entered";
        this.notify();
      })
    );
  }

  private startLeave() {
    if (!this.el) return;
    if (this.state === "left") return;

    this.dispose();
    const el = this.el;
    const classes = this.options.classes;

    // leaveFrom
    el.classList.remove(...Object.values(classes).flat());
    el.classList.add(...classes.className, ...classes.leaveFrom);
    forceStyle(el);

    // leaveFrom => leaveTo
    el.classList.remove(...classes.leaveFrom);
    el.classList.add(...classes.leaveTo);

    // notify after transition
    this.disposables.add(
      onTransitionEnd(el, () => {
        this.state = "left";
        this.notify();
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
      this.dispose();
      this.listeners.delete(listener);
    };
  }

  getSnapshot() {
    return this.state;
  }

  private notify() {
    if (this.listeners.size === 0) return;
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
