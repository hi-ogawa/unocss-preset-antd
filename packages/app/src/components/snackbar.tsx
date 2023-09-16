import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { useStableCallback } from "@hiogawa/utils-react";
import React from "react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { getCollapseProps } from "./collapse";
import { TOAST_STEP, type ToastItem, ToastManager } from "./toast";

// TODO: position
type ToastData = {
  node: React.ReactNode;
  duration: number;
  type?: "success" | "error";
};

type CustomToastItem = ToastItem<ToastData>;

type CustomToastManager = ToastManager<ToastData>;

export const toast = new ToastManager<ToastData>();

export function SnackbarConainer({
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

  const SnackbarAnimation =
    animationType === "1" ? SnackbarAnimation1 : SnackbarAnimation2;

  return (
    <div className="flex flex-col absolute bottom-1 left-2">
      {[...toast.items].reverse().map((item) => (
        <SnackbarAnimation key={item.id} toast={toast} item={item}>
          <SnackbarItem item={item} toast={toast} />
        </SnackbarAnimation>
      ))}
    </div>
  );
}

interface SnackbarAnimationProp {
  item: CustomToastItem;
  toast: CustomToastManager;
  children?: React.ReactNode;
}

function SnackbarAnimation1({ item, toast, children }: SnackbarAnimationProp) {
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

function SnackbarAnimation2({ item, toast, children }: SnackbarAnimationProp) {
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
        enterFrom="translate-y-[120%] scale-0 opacity-10"
        enterTo="translate-y-0 scale-100 opacity-100"
        leaveFrom="translate-y-0 scale-100 opacity-100"
        leaveTo="translate-y-[120%] scale-0 opacity-10"
      >
        {children}
      </Transition>
    </Transition>
  );
}

function SnackbarItem({
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
    () => toast.update(item.id, { step: TOAST_STEP.DISMISS }),
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
              tw.i_ri_checkbox_circle_fill.text_colorSuccess.text_2xl.$,
            item.data.type === "error" &&
              tw.i_ri_error_warning_fill.text_colorError.text_2xl.$
          )}
        />
        <div className="flex-1">{item.data.node}</div>
        <button
          className={
            tw.antd_btn.antd_btn_ghost.i_ri_close_line.text_colorTextSecondary
              .text_lg.$
          }
          onClick={() => toast.update(item.id, { step: TOAST_STEP.DISMISS })}
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
