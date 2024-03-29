import { TransitionManager } from "@hiogawa/tiny-transition";
import { groupBy, includesGuard } from "@hiogawa/utils";
import { h } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import {
  TOAST_TYPE_ICONS,
  TOAST_TYPE_ICON_COLORS,
  slideScaleCollapseTransition,
} from "../common";
import { TOAST_STEP } from "../core";
import { istyle } from "../utils";
import type { PreactToastItem, PreactToastManager } from "./api";

export function ToastContainer({ toast }: { toast: PreactToastManager }) {
  useSubscribe(toast.subscribe);

  const itemsByPosition = groupBy(toast.items, (item) => item.data.position);

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
            bottom: "0.5rem",
            left: "0.75rem",
            display: "flex",
            flexDirection: "column",
          }),
        },
        itemsByPosition
          .get("bottom-left")
          ?.map((item) => h(ToastAnimation, { key: item.id, toast, item }))
      ),
      h(
        "div",
        {
          style: istyle({
            position: "absolute",
            top: "0.5rem",
            width: "100%",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
          }),
        },
        itemsByPosition
          .get("top-center")
          ?.map((item) => h(ToastAnimation, { key: item.id, toast, item }))
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
    return new TransitionManager(false, {
      onEnterFrom: transition.enterFrom,
      onEnterTo: transition.enterTo,
      onEntered: transition.entered,
      onLeaveFrom: transition.leaveFrom,
      onLeaveTo: transition.leaveTo,
      onLeft: () => toast.remove(item.id),
    });
  });

  useSubscribe(manager.subscribe);

  useEffect(() => {
    manager.set(item.step < TOAST_STEP.DISMISS);
  }, [item.step]);

  if (!manager.state) {
    return null;
  }

  return h(
    "div",
    {
      ref: manager.ref,
      style: istyle({
        pointerEvents: "auto",
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
        istyle({
          display: "flex",
          alignItems: "center",
          padding: "10px 10px",
          borderRadius: "8px",
          boxShadow:
            "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
        }) + (item.data.style ?? ""),
    },
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
      { style: istyle({ padding: "0 10px" }) },
      item.data.render({ h, toast, item })
    )
  );
}

function useSubscribe(subscribe: (callback: () => void) => () => void) {
  const rerender = useReducer<boolean, void>((prev) => !prev, false)[1];

  useEffect(() => {
    return subscribe(() => rerender());
  }, [subscribe]);
}
