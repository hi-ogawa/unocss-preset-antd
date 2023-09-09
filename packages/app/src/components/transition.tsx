import { useStableCallback } from "@hiogawa/utils-react";
import React from "react";

// the use case of @headlessui/react is limited to a simple usage of `Transition` component
// so here we implement minimal version on own own

// limitation compared to headlessui
// - always remount
// - no Transition.Child
//   - workaround by setting same `duraion-xxx` for all components + set `appear` for inner components

// references
// - https://github.com/tailwindlabs/headlessui/blob/8e93cd063067bb1ad95d098655670a7d9a4d9e4a/packages/%40headlessui-react/src/components/transitions/transition.tsx
// - https://github.com/tailwindlabs/headlessui/blob/8e93cd063067bb1ad95d098655670a7d9a4d9e4a/packages/%40headlessui-react/src/components/transitions/utils/transition.ts

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

export const Transition = React.forwardRef(function Transition(
  props: {
    show: boolean;
    appear?: boolean;
    as?: string;
  } & TransitionClassProps &
    TransitionCallbacks &
    // TODO: pass all rest props?
    Pick<JSX.IntrinsicElements["div"], "children" | "style">,
  ref: React.ForwardedRef<HTMLElement>
) {
  const [manager] = React.useState(
    () =>
      new TransitionManager({
        initialEntered: Boolean(props.show && !props.appear),
        // TODO: update options
        ...processClassProps(props),
      })
  );

  React.useSyncExternalStore(
    React.useCallback((onStorechange) => manager.subscribe(onStorechange), []),
    () => manager.getSnapshot()
  );

  React.useEffect(() => {
    manager.show(props.show ?? false);
  }, [props.show]);

  const mergedRefs = useMergeRefs(ref, manager.setElement);
  const Component = (props.as as "div") ?? "div";

  return (
    <>
      {manager.shouldRender() && (
        <EffectWrapper
          // TODO: instead of separating effect, use next frame callback during `onLayoutEffect`?
          onLayoutEffect={() => manager.onLayout()}
          onEffect={() => manager.onMount()}
        >
          <Component ref={mergedRefs} style={props.style}>
            {props.children}
          </Component>
        </EffectWrapper>
      )}
    </>
  );
});

function EffectWrapper(props: {
  onEffect: () => void;
  onLayoutEffect: () => void;
  children?: React.ReactNode;
}) {
  React.useLayoutEffect(() => props.onLayoutEffect(), []);
  React.useEffect(() => props.onEffect(), []);
  return <>{props.children}</>;
}

function useMergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useStableCallback((el) => {
    for (const ref of refs) {
      if (ref) {
        if (typeof ref === "function") {
          ref(el);
        } else {
          // @ts-expect-error workaround readonly
          ref.current = el;
        }
      }
    }
  });
}

function processClassProps(
  props: TransitionClassProps & TransitionCallbacks
): TransitionCallbacks {
  // TODO: handle className during ssr with `show=true appear=false`?
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
      props.onEnterFrom?.(el);
    },
    onEnterTo: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.enterTo, ...classes.enter);
      props.onEnterTo?.(el);
    },
    onEntered: (el) => {
      el.classList.remove(...all);
      el.classList.add(...classes.className, ...classes.entered);
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

//
// framework-agnostic animation utility
//

// TODO: is it usable for packages/app-solid/src/components/transition.tsx ?

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
      initialEntered: boolean;
    } & TransitionCallbacks
  ) {
    this.state = this.options.initialEntered ? "entered" : "leaving";
  }

  shouldRender(): boolean {
    return this.state !== "left";
  }

  show(show: boolean) {
    this.dispose();
    if (show && this.state !== "entered") {
      this.state = "entering";
      // normally this is no-op as `this.el === null`.
      // `this.el !== null` happens when `show` flips (true -> false -> true) faster than transition animation.
      this.startEnter();
      this.notify();
    } else if (!show && this.state !== "left") {
      this.state = "leaving";
      this.startLeave();
      this.notify();
    }
  }

  // api compatible with ref callback
  setElement = (el: HTMLElement | null) => {
    this.dispose();
    this.el = el;
  };

  onLayout() {
    if (!this.el) return;
    this.dispose();
    const el = this.el;

    // style before paint
    // TODO: in some cases, "appear" works without this. figure out what's the issue.
    if (this.state === "entered") {
      this.options.onEntered?.(el);
    } else {
      this.options.onEnterFrom?.(el);
    }
  }

  onMount() {
    if (this.state === "entered") return;
    this.dispose();
    this.startEnter();
  }

  private startEnter() {
    if (!this.el) return;
    const el = this.el;

    // "enterFrom" -> "enterTo"
    this.options.onEnterFrom?.(el);
    forceStyle(el);
    this.options.onEnterTo?.(el);

    // notify "entered"
    this.disposables.add(
      onTransitionEnd(el, () => {
        this.state = "entered";
        this.notify(() => this.options.onEntered?.(el));
      })
    );
  }

  private startLeave() {
    if (!this.el) return;
    const el = this.el;

    // "leaveFrom" -> "leaveTo"
    this.options.onLeaveFrom?.(el);
    forceStyle(el);
    this.options.onLeaveTo?.(el);

    // notify "left"
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
  return c.split(" ").filter(Boolean);
}

function forceStyle(el: Element) {
  window.getComputedStyle(el).transition ?? console.log("unreachable");
}
