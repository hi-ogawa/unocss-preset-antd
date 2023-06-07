import { tinyassert, typedBoolean } from "@hiogawa/utils";
import {
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from "solid-js";

//
// simplified port of headlessui Transition
//
// difference from headlessui
// - always wrapped by div
// - always appear = true
// - always remount
// - no callback (beforeEnter, afterEnter, beforeLeave, afterLeave)
// - no Transition.Child
//
// solid-primitive's createSwitchTransition was a tricky so its usage is completely replaced.
//
// cf.
// https://github.com/tailwindlabs/headlessui/blob/14b8c5622661b985903371532dd0d116d6517aba/packages/%40headlessui-react/src/components/transitions/utils/transition.ts
// https://github.com/solidjs-community/solid-primitives/blob/876b583ed95e0c3f0a552882f3508a07fc64fca4/packages/transition-group/src/index.ts#L74
// https://github.com/solidjs-community/solid-primitives/blob/876b583ed95e0c3f0a552882f3508a07fc64fca4/packages/transition-group/dev/switch-page.tsx#L19
//

type TransitionState = "enter" | "leaving" | "left";

interface TransitionClassProps {
  // enter?: string;
  enterFrom?: string;
  enterTo?: string;
  // entered?: string;
  // leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

// TODO
interface TransitionEventProps {
  beforeEnter?: () => void;
  afterEnter?: () => void;
  beforeLeave?: () => void;
  afterLeave?: () => void;
}

export function Transition(
  props: TransitionClassProps &
    TransitionEventProps &
    JSX.HTMLElementTags["div"] & { show?: boolean }
) {
  const [state, setState] = createSignal<TransitionState>("left");

  createEffect(() => {
    if (props.show && state() !== "enter") {
      setState("enter");
    }
    if (!props.show && state() === "enter") {
      setState("leaving");
    }
  });

  return (
    <Show when={state() !== "left"}>
      <TransitionInner {...props} state={state()} setState={setState}>
        {props.children}
      </TransitionInner>
    </Show>
  );
}

function TransitionInner(
  props: TransitionClassProps &
    TransitionEventProps &
    JSX.HTMLElementTags["div"] & {
      state: TransitionState;
      setState: (v: TransitionState) => void;
    }
) {
  let ref!: HTMLElement;

  const classes = createMemo(() => ({
    class: splitClass(props.class ?? ""),
    enterFrom: splitClass(props.enterFrom ?? ""),
    enterTo: splitClass(props.enterTo ?? ""),
    leaveFrom: splitClass(props.leaveFrom ?? ""),
    leaveTo: splitClass(props.leaveTo ?? ""),
  }));

  // "enterFrom" on dom creation (before attached to document)
  function onRef(el: HTMLElement) {
    ref = el;
    ref.classList.remove(...Object.values(classes()).flat());
    ref.classList.add(...classes().class, ...classes().enterFrom);
  }

  // "enterTo" on mount
  onMount(() => {
    forceStyle(ref);
    ref.classList.remove(...classes().enterFrom);
    ref.classList.add(...classes().enterTo);
  });

  // leaveFrom -> leaveTo
  createEffect(() => {
    if (props.state === "leaving") {
      // leaveFrom
      ref.classList.remove(...Object.values(classes()).flat());
      ref.classList.add(...classes().class, ...classes().leaveFrom);
      forceStyle(ref);

      // setup transition state cleanup
      onTransitionEnd(ref, () => props.setState("left"));

      // leaveTo
      ref.classList.remove(...classes().leaveFrom);
      ref.classList.add(...classes().leaveTo);
    }
  });

  return (
    <div ref={onRef} style={props.style}>
      {props.children}
    </div>
  );
}

function onTransitionEnd(el: HTMLElement, callback: () => void) {
  // watch transitionend
  const wrapper = (e: HTMLElementEventMap["transitionend"]) => {
    if (e.target === e.currentTarget) {
      cleanup();
      callback();
    }
  };
  el.addEventListener("transitionend", wrapper);

  // fallback to transitionDuration timeout
  const duration = getComputedStyle(el).transitionDuration;
  const subscription = window.setTimeout(() => {
    cleanup();
    callback();
  }, parseDuration(duration));

  function cleanup() {
    el.removeEventListener("transitionend", wrapper);
    window.clearTimeout(subscription);
  }
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
  tinyassert(typeof window.getComputedStyle(el).transition);
}
