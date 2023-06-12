import { Transition } from "@headlessui/react";
import { tinyassert } from "@hiogawa/utils";
import React from "react";

export function CollapseTransition(
  props: Parameters<typeof Transition>[0] & object
) {
  const collpaseProps = useCollapseProps(props);
  return <Transition {...props} {...collpaseProps} />;
}

export function useCollapseProps(props?: {
  appear?: boolean;
}): Partial<Parameters<typeof Transition>[0]> {
  const refEl = React.useRef<HTMLDivElement>();

  const refCallback: React.RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      // TODO: appear doesn't work on hydration?
      uncollapse(el, Boolean(props?.appear));
    }
    refEl.current = el ?? undefined;
  };

  function uncollapse(el: HTMLDivElement, animate: boolean) {
    const child = el.firstElementChild;
    tinyassert(child);
    if (animate) {
      el.style.height = "0px";
      forceStyle(el);
    }
    el.style.height = child.clientHeight + "px";
  }

  function reset(el: HTMLDivElement) {
    el.style.height = "";
  }

  function collapse(el: HTMLDivElement) {
    const child = el.firstElementChild;
    tinyassert(child);
    el.style.height = child.clientHeight + "px";
    forceStyle(el);
    el.style.height = "0px";
  }

  function beforeEnter() {
    const el = refEl.current;
    tinyassert(el);
    uncollapse(el, true);
  }

  function afterEnter() {
    const el = refEl.current;
    tinyassert(el);
    reset(el);
  }

  function beforeLeave() {
    const el = refEl.current;
    tinyassert(el);
    collapse(el);
  }

  return { ref: refCallback, beforeEnter, afterEnter, beforeLeave };
}

function forceStyle(el: Element) {
  tinyassert(typeof window.getComputedStyle(el).transition);
}
