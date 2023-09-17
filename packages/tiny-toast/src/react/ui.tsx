import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { groupBy, tinyassert } from "@hiogawa/utils";
import { useStableCallback } from "@hiogawa/utils-react";
import React from "react";
import { TOAST_STEP } from "../core";
import type { ReactToastItem, ReactToastManager } from "./api";

export function ReactToastContainer({ toast }: { toast: ReactToastManager }) {
  React.useSyncExternalStore(
    toast.subscribe,
    toast.getSnapshot,
    toast.getSnapshot
  );

  const itemsByPosition = groupBy(toast.items, (item) => item.data.position);

  return (
    <>
      <div className="= flex flex-col absolute bottom-1 left-2">
        {itemsByPosition
          .get("bottom-left")
          ?.reverse()
          .map((item) => (
            <AnimationWrapper key={item.id} toast={toast} item={item}>
              <ItemComponent item={item} toast={toast} />
            </AnimationWrapper>
          ))}
      </div>
      {/* reverse twice to correct z-order */}
      <div className="= flex flex-col-reverse absolute top-1 items-center w-full">
        {itemsByPosition
          .get("top-center")
          ?.reverse()
          .map((item) => (
            <AnimationWrapper key={item.id} toast={toast} item={item}>
              <ItemComponent item={item} toast={toast} />
            </AnimationWrapper>
          ))}
      </div>
    </>
  );
}

interface AnimationProps {
  item: ReactToastItem;
  toast: ReactToastManager;
  children?: React.ReactNode;
}

function AnimationWrapper({ item, toast, children }: AnimationProps) {
  // steps
  // 0. slide in + scale up
  // 1. slide out + scale down + collapse down
  return (
    <Transition
      show={item.step < TOAST_STEP.DISMISS}
      className="= duration-300"
      onLeaveFrom={(el) => {
        tinyassert(el.firstElementChild);
        el.style.height = el.firstElementChild.clientHeight + "px";
      }}
      onLeaveTo={(el) => {
        el.style.height = "0px";
      }}
      onLeft={() => toast.remove(item.id)}
    >
      <Transition
        appear
        show={item.step < TOAST_STEP.DISMISS}
        className="= inline-block duration-300 transform py-1"
        enterFrom={cls(
          "= scale-0 opacity-10",
          item.data.position === "bottom-left" && "= translate-y-[120%]",
          item.data.position === "top-center" && "= translate-y-[-120%]"
        )}
        enterTo="= translate-y-0 scale-100 opacity-100"
        leaveFrom="= translate-y-0 scale-100 opacity-100"
        leaveTo={cls(
          "scale-0 opacity-10",
          item.data.position === "bottom-left" && "= translate-y-[120%]",
          item.data.position === "top-center" && "= translate-y-[-120%]"
        )}
      >
        {children}
      </Transition>
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
  // pause auto-dismiss timeout on hover
  const [pause, setPause] = React.useState(false);

  // auto-dismiss timeout
  useTimeout(
    () => toast.dismiss(item.id),
    pause ? Infinity : item.data.duration
  );

  return (
    <div
      className="antd-floating w-[350px]"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <div className="flex items-center gap-3 p-3">
        <span
          className={cls(
            item.data.type === "success" &&
              "i-ri-checkbox-circle-fill text-colorSuccess text-2xl",
            item.data.type === "error" &&
              "i-ri-error-warning-fill text-colorError text-2xl"
          )}
        />
        <div className="flex-1">{item.data.node}</div>
        <button
          className="antd-btn antd-btn-ghost i-ri-close-line text-colorTextSecondary text-lg"
          onClick={() => toast.dismiss(item.id)}
        />
      </div>
    </div>
  );
}

function useTimeout(f: () => void, ms: number) {
  f = useStableCallback(f);

  React.useEffect(() => {
    if (ms === Infinity) {
      return;
    }
    const t = window.setTimeout(() => f(), ms);
    return () => {
      window.clearTimeout(t);
    };
  }, [ms]);
}

function cls(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}
