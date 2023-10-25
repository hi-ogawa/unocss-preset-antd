import { TOAST_STEP } from "@hiogawa/tiny-toast";
import {
  ReactToastContainer,
  type ReactToastItem,
  type ReactToastManager,
} from "@hiogawa/tiny-toast/dist/react";
import { Transition } from "@hiogawa/tiny-transition/dist/react";
import React from "react";
import { getCollapseProps } from "../collapse";

export function ToastContainer({
  toast,
  animationType,
}: {
  toast: ReactToastManager;
  animationType: string;
}) {
  return (
    <ReactToastContainer
      toast={toast}
      options={{
        className: "!absolute",
        renderAnimation:
          animationType === "custom"
            ? (props) => <CustomAnimation {...props} />
            : animationType === "none"
            ? (props) => <NoAnimation {...props} />
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

function NoAnimation({ item, toast, children }: AnimationProps) {
  React.useEffect(() => {
    if (item.step === TOAST_STEP.DISMISS) {
      toast.remove(item.id);
    }
  }, [item.step]);

  return <div className="py-1">{children}</div>;
}

function CustomAnimation({ item, toast, children }: AnimationProps) {
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

export function CustomToastItemComponent({
  item,
  toast,
}: {
  item: ReactToastItem;
  toast: ReactToastManager;
}) {
  return (
    <div className="antd-floating rounded w-[300px]">
      <div className="flex items-center gap-3 p-3">
        <span className="i-ri-star-smile-fill text-[#ffff88] text-2xl" />
        <div className="flex-1">Close button example</div>
        <button
          className="antd-btn antd-btn-ghost i-ri-close-line text-colorTextSecondary text-lg"
          onClick={() => toast.dismiss(item.id)}
        />
      </div>
    </div>
  );
}
