import { TransitionManager } from "@hiogawa/tiny-transition";
import { type ComponentChild, h, render } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import { TOAST_STEP, type ToastItem, ToastManager } from "../core";

//
// api
//

type RenderItem = (props: {
  h: typeof h;
  item: PreactToastItem;
  toast: PreactToastManager;
}) => ComponentChild;

type MaybeRenderItem = RenderItem | Exclude<ComponentChild, object>;

export interface PreactToastData {
  render: RenderItem;
  style?: string;
  class?: string;
}

export type PreactToastItem = ToastItem<PreactToastData>;

export class PreactToastManager extends ToastManager<PreactToastData> {
  info(render: MaybeRenderItem) {
    this.create(
      { render: typeof render === "function" ? render : () => render },
      { duration: 4000 }
    );
  }

  render(el: Element) {
    render(h(ToastContainer, { toast: this }), el);
    return () => render(null, el);
  }
}

//
// ui
//

function ToastContainer({ toast }: { toast: PreactToastManager }) {
  useSubscribe(toast.subscribe);

  return h(
    "div",
    {
      class: "fixed inset-0 z-9999 pointer-events-none",
      onMouseEnter: () => {
        toast.pause(true);
      },
      onMouseLeave: () => {
        toast.pause(false);
      },
    },
    [
      h(
        "div",
        {
          class: "absolute top-3 flex flex-col-reverse items-center w-full",
        },
        toast.items.map((item) =>
          h(ToastAnimation, { key: item.id, toast, item })
        )
      ),
    ]
  );
}

function ToastAnimation({
  toast,
  item,
}: {
  toast: PreactToastManager;
  item: PreactToastItem;
}) {
  const [manager] = useState(
    () =>
      new TransitionManager({
        defaultEntered: false,
        onEnterFrom: (el) => {
          collapse(el);
          Object.assign(el.style, TRANSITION_STYLES.enterFrom);
        },
        onEnterTo: (el) => {
          uncollapse(el);
          Object.assign(el.style, TRANSITION_STYLES.enterTo);
        },
        onEntered: (el) => {
          resetCollapse(el);
        },
        onLeaveFrom: (el) => {
          uncollapse(el);
          Object.assign(el.style, TRANSITION_STYLES.enterTo);
        },
        onLeaveTo: (el) => {
          collapse(el);
          Object.assign(el.style, TRANSITION_STYLES.enterFrom);
        },
        onLeft: () => toast.remove(item.id),
      })
  );
  useSubscribe(manager.subscribe);

  useEffect(() => {
    manager.show(item.step < TOAST_STEP.DISMISS);
  }, [item.step]);

  if (!manager.shouldRender()) {
    return null;
  }

  return h(
    "div",
    {
      ref: manager.setElement,
      class: "duration-300 transform pointer-events-auto",
    },
    h("div", { class: "py-1" }, h(ToastItemComponent, { toast, item }))
  );
}

const TRANSITION_STYLES = {
  enterFrom: {
    opacity: "0",
    transform: "scale(0) translateY(-120%)",
  },
  enterTo: {
    opacity: "1",
    transform: "scale(1) translateY(0)",
  },
} satisfies Record<string, Partial<CSSStyleDeclaration>>;

function ToastItemComponent({
  toast,
  item,
}: {
  toast: PreactToastManager;
  item: PreactToastItem;
}) {
  return h(
    "div",
    {
      class: item.data.class ?? "rounded-lg shadow-lg",
      style: item.data.style,
    },
    [
      h(
        "div",
        {
          class: "flex items-center p-3",
        },
        [
          h("span", {
            class: "i-ri-information-line text-blue text-2xl",
          }),
          h("div", { class: "px-2" }, item.data.render({ h, toast, item })),
        ]
      ),
    ]
  );
}

//
// utils
//

function useSubscribe(subscribe: (callback: () => void) => () => void) {
  const rerender = useReducer<boolean, void>((prev) => !prev, false)[1];

  useEffect(() => {
    return subscribe(() => rerender());
  }, [subscribe]);
}

function uncollapse(el: HTMLElement) {
  if (el.firstElementChild) {
    el.style.height = el.firstElementChild.clientHeight + "px";
  }
}

function collapse(el: HTMLElement) {
  el.style.height = "0px";
}

function resetCollapse(el: HTMLElement) {
  el.style.height = "";
}
