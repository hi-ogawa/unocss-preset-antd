import {
  Fragment,
  h,
  useEffect,
  useState,
  useSyncExternalStore,
} from "@hiogawa/tiny-react";
import { TransitionManager } from "@hiogawa/tiny-transition";
import { groupBy, includesGuard } from "@hiogawa/utils";
import {
  TOAST_POSITIONS,
  TOAST_TYPE_ICONS,
  TOAST_TYPE_ICON_COLORS,
  slideScaleCollapseTransition,
} from "../common";
import { TOAST_STEP } from "../core";
import { istyle } from "../utils";
import type { TinyReactToastManager, TinyToastItem } from "./api";

export function ToastContainer({ toast }: { toast: TinyReactToastManager }) {
  useSyncExternalStore(toast.subscribe, toast.getSnapshot, toast.getSnapshot);

  const itemsByPosition = groupBy(toast.items, (item) => item.data.position);

  return h.div(
    {
      style: istyle({
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }),
      onmouseenter: () => {
        toast.pause(true);
      },
      onmouseleave: () => {
        toast.pause(false);
      },
    },
    TOAST_POSITIONS.map((position) => {
      const items = itemsByPosition.get(position);
      if (!items) {
        return h(Fragment, { key: position });
      }
      const [y, x] = position.split("-") as ["top", "center"];
      return h.div(
        {
          key: position,
          style:
            CONTAINER_POSITION_STYLES.base +
            CONTAINER_POSITION_STYLES[x] +
            CONTAINER_POSITION_STYLES[y],
        },
        items.map((item) => h(ToastAnimation, { key: item.id, toast, item }))
      );
    })
  );
}

const CONTAINER_POSITION_STYLES = {
  base: istyle({
    display: "flex",
    position: "absolute",
  }),
  bottom: istyle({
    flexDirection: "column",
    bottom: "0.5rem",
  }),
  top: istyle({
    flexDirection: "column-reverse",
    top: "0.5rem",
  }),
  left: istyle({
    left: "0.75rem",
    alignItems: "flex-start",
  }),
  right: istyle({
    right: "0.75rem",
    alignItems: "flex-end",
  }),
  center: istyle({
    alignItems: "center",
    width: "100%",
  }),
};

function ToastAnimation({
  toast,
  item,
}: {
  toast: TinyReactToastManager;
  item: TinyToastItem;
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

  const state = useSyncExternalStore(
    manager.subscribe,
    () => manager.state,
    () => manager.state
  );

  useEffect(() => {
    manager.set(item.step < TOAST_STEP.DISMISS);
  }, [item.step]);

  if (!state) {
    return h(Fragment, {});
  }

  return h.div(
    {
      ref: manager.ref,
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
  toast,
  item,
}: {
  toast: TinyReactToastManager;
  item: TinyToastItem;
}) {
  return h.div(
    {
      className: item.data.className,
      style:
        istyle({
          color: "rgba(0, 0, 0, 0.88)",
          background: "white",
          display: "flex",
          alignItems: "center",
          padding: "10px 10px",
          borderRadius: "8px",
          boxShadow:
            "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
        }) + (item.data.style ?? ""),
    },
    includesGuard(["success", "error", "info"] as const, item.data.type) &&
      h.span({
        key: item.data.type,
        // ref callback to imitate dangerouslySetInnerHTML
        ref: (el) => {
          if (el && !el.innerHTML) {
            el.innerHTML = TOAST_TYPE_ICONS[item.data.type as "success"];
          }
        },
        style: istyle({
          width: "1.5rem",
          height: "1.5rem",
          color: TOAST_TYPE_ICON_COLORS[item.data.type],
        }),
      }),
    h.div(
      { style: istyle({ padding: "0 10px" }) },
      item.data.message({ h, item, toast }) as any
    )
  );
}
