import {
  Fragment,
  h,
  useEffect,
  useReducer,
  useState,
} from "@hiogawa/tiny-react";
import { TransitionManager } from "@hiogawa/tiny-transition";
import { includesGuard } from "@hiogawa/utils";
import {
  TOAST_TYPE_ICONS,
  TOAST_TYPE_ICON_COLORS,
  slideScaleCollapseTransition,
} from "../common";
import { TOAST_STEP } from "../core";
import { istyle } from "../utils";
import type { XToastItem, XToastManager } from "./api";

// almost same as preact

export function ToastContainer({ toast }: { toast: XToastManager }) {
  useSubscribe(toast.subscribe);

  return h.div(
    {
      style: istyle({
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }),
    },
    h.div(
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
      toast.items.map((item) =>
        h(ToastAnimation, { key: item.id, toast, item })
      )
    )
  );
}

function ToastAnimation({
  toast,
  item,
}: {
  toast: XToastManager;
  item: XToastItem;
}) {
  const [manager] = useState(() => {
    const transition = slideScaleCollapseTransition({
      position: "top-center",
    });
    const manager = new TransitionManager({
      defaultEntered: false,
      onEnterFrom: transition.enterFrom,
      onEnterTo: transition.enterTo,
      onEntered: transition.entered,
      onLeaveFrom: transition.leaveFrom,
      onLeaveTo: transition.leaveTo,
      onLeft: () => toast.remove(item.id),
    });
    return manager;
  });

  useSubscribe(manager.subscribe);

  useEffect(() => {
    manager.show(item.step < TOAST_STEP.DISMISS);
  }, [item.step]);

  if (!manager.shouldRender()) {
    return h(Fragment, {});
  }

  return h.div(
    {
      ref: manager.setElement,
    },
    h.div(
      {
        style: istyle({
          pointerEvents: "auto",
          display: "inline-block",
          padding: "0.25rem 0",
        }),
      },
      h(ToastItemComponent, { toast, item })
    )
  );
}

function ToastItemComponent({
  item,
}: {
  toast: XToastManager;
  item: XToastItem;
}) {
  return h.div(
    {
      style: istyle({
        display: "flex",
        alignItems: "center",
        padding: "10px 10px",
        borderRadius: "8px",
        boxShadow:
          "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
      }),
    },
    includesGuard(["success", "error", "info"] as const, item.data.type) &&
      h.span({
        key: item.data.type,
        // ref callback to imitate dangerouslySetInnerHTML
        ref: (el) => {
          if (el) {
            el.innerHTML = TOAST_TYPE_ICONS[item.data.type as "success"];
          }
        },
        style: istyle({
          width: "1.5rem",
          height: "1.5rem",
          color: TOAST_TYPE_ICON_COLORS[item.data.type],
        }),
      }),
    h.div({ style: istyle({ padding: "0 10px" }) }, item.data.message)
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
