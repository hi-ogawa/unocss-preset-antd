import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { groupBy, includesGuard } from "@hiogawa/utils";
import React from "react";
import {
  TOAST_TYPE_ICONS,
  TOAST_TYPE_ICON_COLORS,
  slideScaleCollapseTransition,
} from "../common";
import { TOAST_STEP } from "../core";
import type {
  ReactToastContainerOptions,
  ReactToastItem,
  ReactToastManager,
} from "./api";

export function ReactToastContainer({
  toast,
  options,
}: {
  toast: ReactToastManager;
  options?: ReactToastContainerOptions;
}) {
  React.useSyncExternalStore(
    toast.subscribe,
    toast.getSnapshot,
    toast.getSnapshot
  );

  const itemsByPosition = React.useMemo(
    () => groupBy(toast.items, (item) => item.data.position),
    [toast.items]
  );

  const renderAnimation =
    options?.renderAnimation ?? ((props) => <AnimationWrapper {...props} />);

  const render = (item: ReactToastItem) => (
    <React.Fragment key={item.id}>
      {renderAnimation({
        toast,
        item,
        children: <ItemComponent toast={toast} item={item} />,
      })}
    </React.Fragment>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        ...options?.style,
      }}
      className={options?.className}
      onMouseEnter={() => toast.pause(true)}
      onMouseLeave={() => toast.pause(false)}
    >
      {/* note that we use AnimationWrapper's "py" to give uniform gap for collapse animation */}
      <div
        style={{
          position: "absolute",
          bottom: "0.5rem",
          left: "0.75rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {itemsByPosition.get("bottom-left")?.map((item) => render(item))}
      </div>
      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          width: "100%",
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
        }}
      >
        {itemsByPosition.get("top-center")?.map((item) => render(item))}
      </div>
    </div>
  );
}

function AnimationWrapper({
  item,
  toast,
  children,
}: {
  item: ReactToastItem;
  toast: ReactToastManager;
  children?: React.ReactNode;
}) {
  const transition = slideScaleCollapseTransition({
    position: item.data.position,
  });

  return (
    <Transition
      appear
      show={item.step < TOAST_STEP.DISMISS}
      style={{ pointerEvents: "auto" }}
      onEnterFrom={transition.enterFrom}
      onEnterTo={transition.enterTo}
      onEntered={transition.entered}
      onLeaveFrom={transition.leaveFrom}
      onLeaveTo={transition.leaveTo}
      onLeft={() => toast.remove(item.id)}
    >
      <div style={{ display: "inline-block", padding: "0.25rem 0" }}>
        {children}
      </div>
    </Transition>
  );
}

function ItemComponent({
  item,
  toast,
}: {
  item: ReactToastItem;
  toast: ReactToastManager;
}) {
  if (item.data.type === "custom") {
    return <>{item.data.render({ item, toast })}</>;
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 10px",
        borderRadius: "8px",
        boxShadow:
          "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
        ...item.data.style,
      }}
      className={item.data.className}
    >
      {includesGuard(["success", "error", "info"] as const, item.data.type) && (
        <span
          style={{
            width: "1.5rem",
            height: "1.5rem",
            color: TOAST_TYPE_ICON_COLORS[item.data.type],
          }}
          dangerouslySetInnerHTML={{
            __html: TOAST_TYPE_ICONS[item.data.type],
          }}
        />
      )}
      <div style={{ padding: "0 10px" }}>
        {item.data.render({ item, toast })}
      </div>
    </div>
  );
}
