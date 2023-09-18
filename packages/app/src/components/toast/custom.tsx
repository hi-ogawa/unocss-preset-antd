import { TOAST_STEP } from "@hiogawa/tiny-toast";
import {
  ReactToastContainer,
  type ReactToastItem,
  type ReactToastManager,
} from "@hiogawa/tiny-toast/dist/react";
import { Transition } from "@hiogawa/tiny-transition/dist/react";
import React from "react";
import { cls } from "../../utils/misc";
import { getCollapseProps } from "../collapse";

export function ToastContainer({
  toast,
  animationType,
  toastType,
}: {
  toast: ReactToastManager;
  animationType: string;
  toastType: string;
}) {
  return (
    <ReactToastContainer
      toast={toast}
      options={{
        className: "!absolute",
        renderAnimation:
          animationType === "custom"
            ? (props) => <Animation1 {...props} />
            : undefined,
        renderItem:
          toastType === "custom"
            ? (props) => <ToastItemComponent1 {...props} />
            : undefined,
      }}
    />
  );
}

interface AnimationProps {
  item: ReactToastItem;
  toast: ReactToastManager;
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

function ToastItemComponent1({
  item,
  toast,
}: {
  item: ReactToastItem;
  toast: ReactToastManager;
}) {
  return (
    <div className="antd-floating w-[350px]">
      <div className="flex items-center gap-3 p-3">
        {item.data.type && (
          <span
            className={cls(
              item.data.type === "success" &&
                "i-ri-checkbox-circle-fill text-colorSuccess text-2xl",
              item.data.type === "error" &&
                "i-ri-alert-fill text-colorError text-2xl",
              item.data.type === "info" && "i-ri-information-line text-2xl"
            )}
          />
        )}
        <div className="flex-1">{item.data.node}</div>
        <button
          className="antd-btn antd-btn-ghost i-ri-close-line text-colorTextSecondary text-lg"
          onClick={() => toast.dismiss(item.id)}
        />
      </div>
    </div>
  );
}
