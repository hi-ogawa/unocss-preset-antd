import { Transition } from "@headlessui/react";
import { tinyassert } from "@hiogawa/utils";
import React from "react";
import type { Transition2 } from "./transition";

export function CollapseTransition(
  props: Parameters<typeof Transition>[0] & object
) {
  const collpaseProps = useCollapseProps();
  return <Transition {...props} {...collpaseProps} />;
}

export function useCollapseProps(): Partial<Parameters<typeof Transition>[0]> {
  const refEl = React.useRef<HTMLDivElement>();

  const refCallback: React.RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      uncollapse(el);
    }
    refEl.current = el ?? undefined;
  };

  function uncollapse(el: HTMLDivElement) {
    const child = el.firstElementChild;
    tinyassert(child);
    el.style.height = child.clientHeight + "px";
  }

  function collapse(el: HTMLDivElement) {
    el.style.height = "0px";
  }

  function beforeEnter() {
    const el = refEl.current;
    tinyassert(el);
    uncollapse(el);
  }

  function beforeLeave() {
    const el = refEl.current;
    tinyassert(el);
    collapse(el);
  }

  return { ref: refCallback, beforeEnter, beforeLeave };
}

export function getCollapseProps2(): Partial<
  Parameters<typeof Transition2>[0]
> {
  function uncollapse(el: HTMLElement) {
    const child = el.firstElementChild;
    tinyassert(child);
    el.style.height = child.clientHeight + "px";
  }

  function collapse(el: HTMLElement) {
    el.style.height = "0px";
  }

  return {
    onEnterFrom: collapse,
    onEnterTo: uncollapse,
    onLeaveFrom: uncollapse,
    onLeaveTo: collapse,
  };
}
