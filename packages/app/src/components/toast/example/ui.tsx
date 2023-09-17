import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { groupBy } from "@hiogawa/utils";
import { useStableCallback } from "@hiogawa/utils-react";
import React from "react";
import { cls } from "../../../utils/misc";
import { getCollapseProps } from "../../collapse";
import { TOAST_STEP } from "../core";
import type { CustomToastItem, CustomToastManager } from "./api";

//
// example toast implementation for react
//

export function ToastContainer({
  toast,
  animationType,
}: {
  toast: CustomToastManager;
  animationType: string;
}) {
  React.useSyncExternalStore(
    toast.subscribe,
    toast.getSnapshot,
    toast.getSnapshot
  );

  const AnimationWrapper = animationType === "1" ? Animation1 : Animation2;

  const itemsByPosition = groupBy(toast.items, (item) => item.data.position);

  return (
    <>
      <div className="flex flex-col absolute bottom-1 left-2">
        {itemsByPosition
          .get("bottom-left")
          ?.reverse()
          .map((item) => (
            <AnimationWrapper key={item.id} toast={toast} item={item}>
              <ToastItemComponent item={item} toast={toast} />
            </AnimationWrapper>
          ))}
      </div>
      {/* reverse twice to correct z-order */}
      <div className="flex flex-col-reverse absolute top-1 items-center w-full">
        {itemsByPosition
          .get("top-center")
          ?.reverse()
          .map((item) => (
            <AnimationWrapper key={item.id} toast={toast} item={item}>
              <ToastItemComponent item={item} toast={toast} />
            </AnimationWrapper>
          ))}
      </div>
    </>
  );
}

interface AnimationProps {
  item: CustomToastItem;
  toast: CustomToastManager;
  children?: React.ReactNode;
}

function Animation1({ item, toast, children }: AnimationProps) {
  // TODO: "center" position doesn't make sense...

  // steps
  // 0. slide in
  // 1. slide out
  // 1.5 collapse down
  return (
    <Transition
      show={item.step < TOAST_STEP.DISMISS + 0.5}
      className="duration-300"
      onLeft={() => toast.remove(item.id)}
      {...getCollapseProps()}
    >
      <Transition
        appear
        show={item.step < TOAST_STEP.DISMISS}
        className="inline-block duration-500 transform py-1"
        enterFrom="translate-x-[-120%]"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-[-120%]"
        onLeft={() => toast.update(item.id, { step: TOAST_STEP.DISMISS + 0.5 })}
      >
        {children}
      </Transition>
    </Transition>
  );
}

function Animation2({ item, toast, children }: AnimationProps) {
  // steps
  // 0. slide in + scale up
  // 1. slide out + scale down + collapse down
  return (
    <Transition
      show={item.step < TOAST_STEP.DISMISS}
      className="duration-300"
      onLeft={() => toast.remove(item.id)}
      {...getCollapseProps()}
    >
      <Transition
        appear
        show={item.step < TOAST_STEP.DISMISS}
        className="inline-block duration-300 transform py-1"
        enterFrom={cls(
          "scale-0 opacity-10",
          item.data.position === "bottom-left" && "translate-y-[120%]",
          item.data.position === "top-center" && "translate-y-[-120%]"
        )}
        enterTo={cls("translate-y-0 scale-100 opacity-100")}
        leaveFrom={cls("translate-y-0 scale-100 opacity-100")}
        leaveTo={cls(
          "scale-0 opacity-10",
          item.data.position === "bottom-left" && "translate-y-[120%]",
          item.data.position === "top-center" && "translate-y-[-120%]"
        )}
      >
        {children}
      </Transition>
    </Transition>
  );
}

function ToastItemComponent({
  item,
  toast,
}: {
  item: CustomToastItem;
  toast: CustomToastManager;
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
