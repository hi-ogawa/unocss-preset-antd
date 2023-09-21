import { TransitionManager } from "@hiogawa/tiny-transition";
import type * as CSS from "csstype";
import { h } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import { TOAST_STEP } from "../core";
import type { PreactToastItem, PreactToastManager } from "./api";

export function ToastContainer({ toast }: { toast: PreactToastManager }) {
  useSubscribe(toast.subscribe);

  // TODO: handle ToastPosition
  return h(
    "div",
    {
      style: istyle({
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }),
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
          style: istyle({
            position: "absolute",
            top: "3px",
            width: "100%",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
          }),
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
      style: istyle({
        transitionDuration: "200ms",
        pointerEvents: "auto",
      }),
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
      class: item.data.class,
      style:
        item.data.style ??
        istyle({
          borderRadius: "8px",
          boxShadow:
            "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
        }),
    },
    [
      h(
        "div",
        {
          style: istyle({
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
          }),
        },
        [
          // TODO: inline icon
          item.data.type === "success" &&
            h("span", {
              class: "i-ri-checkbox-circle-fill text-green text-2xl",
            }),
          item.data.type === "error" &&
            h("span", {
              class: "i-ri-close-circle-fill text-red text-2xl",
            }),
          item.data.type === "info" &&
            h("span", {
              class: "i-ri-information-line text-blue text-2xl",
            }),
          h(
            "div",
            { style: istyle({ padding: "0 0.5rem" }) },
            item.data.render({ h, toast, item })
          ),
        ]
      ),
    ]
  );
}

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

// type-safe inline style util based on csstype
// cf. https://github.com/cristianbote/goober/blob/a849b2d644146d96fa1dd1c560f6418ee1e1c469/src/core/parse.js#L48
function istyle(props: CSS.Properties): string {
  return Object.entries(props)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, "-$&").toLowerCase()}:${v}`)
    .join(";");
}
