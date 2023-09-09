import type { Transition2 } from "./transition";

export function getCollapseProps2(): Partial<
  Parameters<typeof Transition2>[0]
> {
  function uncollapse(el: HTMLElement) {
    if (el.firstElementChild) {
      el.style.height = el.firstElementChild.clientHeight + "px";
    }
  }

  function collapse(el: HTMLElement) {
    el.style.height = "0px";
  }

  return {
    onEnterFrom: collapse,
    onEnterTo: uncollapse,
    onEntered: uncollapse,
    onLeaveFrom: uncollapse,
    onLeaveTo: collapse,
  };
}
