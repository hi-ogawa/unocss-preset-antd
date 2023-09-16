import type { Transition } from "@hiogawa/tiny-transition/dist/react";

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
    // slight hack for toast animation
    // without this collapse parent cannot see children's height
    onEntered: (el) =>
      window.requestAnimationFrame(() => {
        uncollapse(el);
      }),
    onLeaveFrom: uncollapse,
    onLeaveTo: collapse,
  };
}
