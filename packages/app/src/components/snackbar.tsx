import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { useStableCallback } from "@hiogawa/utils-react";
import React from "react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { getCollapseProps } from "./collapse";
import { type SnackbarItemState, useSnackbar } from "./snackbar-hook";
import { TOAST_STEP } from "./toast";

export function SnackbarConainer(props: {
  animationType: string;
  durationClassName: string;
}) {
  const manager = useSnackbar();

  const SnackbarAnimation =
    props.animationType === "1" ? SnackbarAnimation1 : SnackbarAnimation2;

  return (
    <div className="flex flex-col absolute bottom-1 left-2">
      {[...manager.items].reverse().map((item) => (
        <SnackbarAnimation
          key={item.id}
          item={item}
          durationClassName={props.durationClassName}
          setStep={(step: number) => manager.update(item.id, { step })}
        >
          <SnackbarItem
            item={item}
            onClose={() =>
              manager.update(item.id, { step: TOAST_STEP.DISMISS })
            }
          />
        </SnackbarAnimation>
      ))}
    </div>
  );
}

interface SnackbarAnimationProp {
  item: SnackbarItemState;
  setStep: (step: number) => void;
  durationClassName: string; // TODO: let ToastManager handle auto-dismiss timeout
  children?: React.ReactNode;
}

function SnackbarAnimation1(props: SnackbarAnimationProp) {
  const duration = Number(props.durationClassName.split("-")[1]);
  useTimeout(() => props.setStep(TOAST_STEP.DISMISS), duration);

  // 0.  slide in
  // 1.  slide out
  // 1.5 collapse down
  const step = props.item.step;
  return (
    <Transition
      show={step < TOAST_STEP.DISMISS + 0.5}
      className="duration-300"
      onLeft={() => props.setStep(TOAST_STEP.REMOVE)}
      {...getCollapseProps()}
    >
      <Transition
        appear
        show={step < TOAST_STEP.DISMISS}
        className="inline-block duration-500 transform py-1"
        enterFrom="translate-x-[-120%]"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-[-120%]"
        onLeft={() => props.setStep(TOAST_STEP.DISMISS + 0.5)}
      >
        {props.children}
      </Transition>
    </Transition>
  );
}

function SnackbarAnimation2(props: SnackbarAnimationProp) {
  const duration = Number(props.durationClassName.split("-")[1]);
  useTimeout(() => props.setStep(TOAST_STEP.DISMISS), duration);

  // 0. slide in + scale up
  // 1. slide out + scale down + collapse down
  const step = props.item.step;
  return (
    <Transition
      show={step < TOAST_STEP.DISMISS}
      className="duration-300"
      onLeft={() => props.setStep(TOAST_STEP.REMOVE)}
      {...getCollapseProps()}
    >
      <Transition
        appear
        show={step < TOAST_STEP.DISMISS}
        className="inline-block duration-300 transform py-1"
        enterFrom="translate-y-[120%] scale-0 opacity-10"
        enterTo="translate-y-0 scale-100 opacity-100"
        leaveFrom="translate-y-0 scale-100 opacity-100"
        leaveTo="translate-y-[120%] scale-0 opacity-10"
      >
        {props.children}
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

function SnackbarItem(props: { item: SnackbarItemState; onClose: () => void }) {
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
          onClick={props.onClose}
        />
      </div>
    </div>
  );
}
