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
  // TODO: pause on hover?
  useTimeout(
    () => toast.update(item.id, { step: TOAST_STEP.DISMISS }),
    item.data.duration
  );

  // 0.  slide in
  // 1.  slide out
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
  useTimeout(
    () => toast.update(item.id, { step: TOAST_STEP.DISMISS }),
    item.data.duration
  );

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

function useTimeout(f: () => void, ms: number) {
  f = useStableCallback(f);

  React.useEffect(() => {
    const t = window.setTimeout(() => f(), ms);
    return () => {
      window.clearTimeout(t);
    };
  }, []);
}

function SnackbarItem(props: {
  item: CustomToastItem;
  toast: CustomToastManager;
}) {
  return (
    <div className="antd-floating w-[350px]">
      <div className="flex items-center gap-3 p-3">
        <span
          className={cls(
            props.item.data.type === "success" &&
              tw.i_ri_checkbox_circle_fill.text_colorSuccess.text_2xl.$,
            props.item.data.type === "error" &&
              tw.i_ri_error_warning_fill.text_colorError.text_2xl.$
          )}
        />
        <div className="flex-1">{props.item.data.node}</div>
        <button
          className={
            tw.antd_btn.antd_btn_ghost.i_ri_close_line.text_colorTextSecondary
              .text_lg.$
          }
          onClick={() =>
            props.toast.update(props.item.id, { step: TOAST_STEP.DISMISS })
          }
        />
      </div>
    </div>
  );
}
