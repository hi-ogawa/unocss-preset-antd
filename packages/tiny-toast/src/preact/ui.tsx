import { TransitionManager } from "@hiogawa/tiny-transition";
import { includesGuard } from "@hiogawa/utils";
import type * as CSS from "csstype";
import { h } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import {
  TOAST_TYPE_ICONS,
  TOAST_TYPE_ICON_COLORS,
  slideScaleCollapseTransition,
} from "../common";
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
  const [manager] = useState(() => {
    const transition = slideScaleCollapseTransition({
      position: item.data.position,
    });
    const manager = new TransitionManager({
      defaultEntered: false,
      onEnterFrom: transition.out,
      onEnterTo: transition.in,
      onEntered: transition.reset,
      onLeaveFrom: transition.in,
      onLeaveTo: transition.out,
      onLeft: () => toast.remove(item.id),
    });
    return manager;
  });

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
        pointerEvents: "auto",
        transitionDuration: "200ms",
      }),
    },
    h(
      "div",
      { style: istyle({ display: "inline-block", padding: "0.25rem 0" }) },
      h(ToastItemComponent, { toast, item })
    )
  );
}

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
          display: "flex",
          alignItems: "center",
          padding: "8px 10px",
          borderRadius: "8px",
          boxShadow:
            "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
        }),
    },
    [
      includesGuard(["success", "error", "info"] as const, item.data.type) &&
        h("span", {
          style: istyle({
            width: "1.5rem",
            height: "1.5rem",
            color: TOAST_TYPE_ICON_COLORS[item.data.type],
          }),
          dangerouslySetInnerHTML: {
            __html: TOAST_TYPE_ICONS[item.data.type],
          },
        }),
      h(
        "div",
        { style: istyle({ padding: "0 0.5rem" }) },
        item.data.render({ h, toast, item })
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

// type-safe inline style util based on csstype
// cf. https://github.com/cristianbote/goober/blob/a849b2d644146d96fa1dd1c560f6418ee1e1c469/src/core/parse.js#L48
function istyle(props: CSS.Properties): string {
  return Object.entries(props)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, "-$&").toLowerCase()}:${v}`)
    .join(";");
}
