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

// TODO: rename "enter" => "entering"?
type TransitionState = "enter" | "leaving" | "left";

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
  props: React.PropsWithChildren<
    { show?: boolean } & TransitionClassProps & TransitionEventProps
  >
) {
  const [state, setState] = React.useState<TransitionState>("left");

  React.useEffect(() => {
    if (props.show && state !== "enter") {
      setState("enter");
    }
    if (!props.show && state === "enter") {
      setState("leaving");
    }
  }, [props.show, state]);

  return (
    <>
      {state !== "left" && (
        <TransitionInner state={state} setState={setState} {...props} />
      )}
    </>
  );
}

function TransitionInner(
  props: React.PropsWithChildren<
    {
      state: TransitionState;
      setState: (v: TransitionState) => void;
    } & TransitionClassProps &
      TransitionEventProps
  >
) {
  const [manager] = React.useState(
    () =>
      new TransitionManager({
        classes: {
          className: splitClass(props.className ?? ""),
          enterFrom: splitClass(props.enterFrom ?? ""),
          enterTo: splitClass(props.enterTo ?? ""),
          leaveFrom: splitClass(props.leaveFrom ?? ""),
          leaveTo: splitClass(props.leaveTo ?? ""),
        },
        afterLeave: () => {
          props.setState("left");
        },
      })
  );

  React.useSyncExternalStore(
    React.useCallback((onStorechange) => manager.subscribe(onStorechange), []),
    () => manager.state
  );

  // element
  const onRef = React.useCallback((el: HTMLElement | null) => {
    if (el) {
      manager.onCreate(el);
    } else {
      manager.onDestroy();
    }
  }, []);

  // mount
  React.useEffect(() => {
    manager.startEnter();
  }, []);

  // hide
  React.useEffect(() => {
    if (props.state === "leaving") {
      manager.startLeave();
    }
  }, [props.state]);

  // TODO: delegate other props
  return <div ref={onRef}>{props.children}</div>;
}

class TransitionManager {
  private listeners = new Set<() => void>();
  private disposables = new Set<() => void>();
  state: TransitionState = "left";
  el?: HTMLElement;

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
      afterEnter?: () => void;
      afterLeave?: () => void;
    }
  ) {}

  onCreate(el: HTMLElement) {
    this.el = el;
    const classes = this.options.classes;

    // early setup enterFrom
    el.classList.remove(...Object.values(classes).flat());
    el.classList.add(...classes.className, ...classes.enterFrom);
  }

  onDestroy() {
    this.dispose();
    this.el = undefined;
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
    this.disposables.add(onTransitionEnd(el, () => this.notify("afterEnter")));
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
    this.disposables.add(onTransitionEnd(el, () => this.notify("afterLeave")));
  }

  private dispose() {
    this.disposables.forEach((f) => f());
    this.disposables.clear();
  }

  // api for React.useSyncExternalStore
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(type: "afterLeave" | "afterEnter") {
    if (this.listeners.size === 0) return;
    this.options[type]?.();
    this.listeners.forEach((f) => f());
  }
}

//
// utils
//

function onTransitionEnd(el: HTMLElement, callback: () => void) {
  // watch `transitionend`
  const handler = (e: HTMLElementEventMap["transitionend"]) => {
    if (e.target === e.currentTarget) {
      dispose();
      callback();
    }
  };
  el.addEventListener("transitionend", handler);

  // also setup `transitionDuration` timeout as a fallback
  const duration = getComputedStyle(el).transitionDuration;
  const subscription = window.setTimeout(() => {
    dispose();
    callback();
  }, parseDuration(duration));

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
