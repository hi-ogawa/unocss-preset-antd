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
    h(
      "div",
      { style: istyle({ padding: "0.25rem 0" }) },
      h(ToastItemComponent, { toast, item })
    )
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
          padding: "8px 10px",
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
          }),
        },
        [
          item.data.type === "success" &&
            h("span", {
              style: istyle({
                width: "1.5rem",
                height: "1.5rem",
                color: "#61d345",
              }),
              // https://remixicon.com/icon/checkbox-circle-fill
              dangerouslySetInnerHTML: {
                __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path></svg>`,
              },
            }),
          item.data.type === "error" &&
            h("span", {
              style: istyle({
                width: "1.5rem",
                height: "1.5rem",
                color: "#ff4b4b",
              }),
              // https://remixicon.com/icon/close-circle-fill
              dangerouslySetInnerHTML: {
                __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path></svg>`,
              },
            }),
          item.data.type === "info" &&
            h("span", {
              style: istyle({
                width: "1.5rem",
                height: "1.5rem",
                color: "#1677ff",
              }),
              // https://remixicon.com/icon/information-fill
              dangerouslySetInnerHTML: {
                __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path></svg>`,
              },
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
