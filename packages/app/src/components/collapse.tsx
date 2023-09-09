import type { Transition } from "./transition";

export function getCollapseProps(): Partial<
  React.ComponentProps<typeof Transition>
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
