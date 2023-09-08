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
        appear: props.appear,
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
    () => manager.rendered
  );

  React.useEffect(() => {
    manager.show(props.show ?? false);
  }, [props.show]);

  return (
    <>
      {manager.rendered && (
        <EffectWrapper
          onLayoutEffect={() => manager.onLayout()}
          onEffect={() => manager.startEnter()}
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

class TransitionManager {
  private listeners = new Set<() => void>();
  private disposables = new Set<() => void>();
  rendered: boolean = false;
  el: HTMLElement | null = null;

  constructor(
    private options: {
      // TODO: manager itself doesn't have to be aware of classes?
      //       must support via beforeEnter/afterEnter/beforeLeave/afterLeave callbacks?
      classes: {
        className: string[];
        enterFrom: string[];
        enterTo: string[];
        leaveFrom: string[];
        leaveTo: string[];
      };
      beforeEnterFrom?: () => void;
      beforeEnterTo?: () => void;
      afterEnter?: () => void;
      beforeLeaveFrom?: () => void;
      beforeLeaveTo?: () => void;
      afterLeave?: () => void;
      appear?: boolean;
    }
  ) {}

  show(show: boolean) {
    if (show && !this.rendered) {
      this.rendered = true;
      this.notify();
    }
    if (!show && this.rendered) {
      this.startLeave();
    }
  }

  // api for ref callback
  setElement = (el: HTMLElement | null) => {
    this.dispose();
    this.el = el;
  };

  onLayout() {
    if (!this.el) return;

    // handle "enterFrom" before paint
    // TODO: sometimes "appear" works without this, so not entirely sure why.
    const el = this.el;
    const classes = this.options.classes;
    el.classList.remove(...Object.values(classes).flat());
    el.classList.add(...classes.className, ...classes.enterFrom);
  }

  startEnter() {
    if (!this.el) return;
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
        this.notify("afterEnter");
      })
    );
  }

  startLeave() {
    if (!this.el) return;
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
        this.rendered = false;
        this.notify("afterLeave");
      })
    );
  }

  private dispose() {
    this.disposables.forEach((f) => f());
    this.disposables.clear();
  }

  // api for React.useSyncExternalStore
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.dispose();
      this.listeners.delete(listener);
    };
  }

  private notify(type?: "afterLeave" | "afterEnter") {
    if (this.listeners.size === 0) return;
    if (type) {
      this.options[type]?.();
    }
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
