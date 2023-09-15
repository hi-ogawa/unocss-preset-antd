import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { getCollapseProps } from "./collapse";
import {
  type SnackbarItemOptions,
  type SnackbarItemState,
  useSnackbar,
} from "./snackbar-hook";

export function SnackbarConainer(props: {
  animationType: string;
  durationClassName: string;
}) {
  const { items, update, remove } = useSnackbar();

  const SnackbarAnimation =
    props.animationType === "1" ? SnackbarAnimation1 : SnackbarAnimation2;

  return (
    <div className="flex flex-col absolute bottom-1 left-2">
      {[...items].reverse().map((item) => (
        <SnackbarAnimation
          key={item.id}
          item={item}
          durationClassName={props.durationClassName}
          setStep={(step: number) => update(item.id, { step })}
          remove={() => remove(item.id)}
        >
          <SnackbarItem
            type={item.options?.type}
            onClose={() => update(item.id, { step: Infinity })}
          >
            {item.node}
          </SnackbarItem>
        </SnackbarAnimation>
      ))}
    </div>
  );
}

interface SnackbarAnimationProp {
  item: SnackbarItemState;
  setStep: (step: number) => void;
  remove: () => void;
  durationClassName: string; // TODO: let ToastManager handle auto-dismiss timeout
  children?: React.ReactNode;
}

function SnackbarAnimation1(props: SnackbarAnimationProp) {
  const step = props.item.step;
  return (
    <>
      {/*  */}
      {/* collpase transition */}
      {/*  */}
      <Transition
        show={step < 2}
        className="duration-300"
        onLeft={() => props.remove()}
        {...getCollapseProps()}
      >
        {/*  */}
        {/* slide transtion */}
        {/*  */}
        <Transition
          appear
          show={step < 1}
          className="inline-block duration-500 transform py-1"
          enterFrom="translate-x-[-120%]"
          enterTo="translate-x-0"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-[-120%]"
          onLeft={() => props.setStep(2)}
        >
          {props.children}
        </Transition>
        {/*  */}
        {/* dummy transition to auto trigger slide-out after timeout */}
        {/*  */}
        <Transition
          appear
          show={step < 1}
          className={props.durationClassName}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          onEntered={() => props.setStep(1)}
        />
      </Transition>
    </>
  );
}

function SnackbarAnimation2(props: SnackbarAnimationProp) {
  const step = props.item.step;
  return (
    <>
      {/*  */}
      {/* collpase transition */}
      {/*  */}
      <Transition
        show={step < 1}
        className="duration-300"
        onLeft={() => props.remove()}
        {...getCollapseProps()}
      >
        {/*  */}
        {/* slide/scale transtion */}
        {/*  */}
        <Transition
          appear
          show={step < 1}
          className="inline-block duration-300 transform py-1"
          enterFrom="translate-y-[120%] scale-0 opacity-10"
          enterTo="translate-y-0 scale-100 opacity-100"
          leaveFrom="translate-y-0 scale-100 opacity-100"
          leaveTo="translate-y-[120%] scale-0 opacity-10"
        >
          {props.children}
        </Transition>
        {/*  */}
        {/* dummy transition to auto dismiss on timeout */}
        {/*  */}
        <Transition
          appear
          show={step < 1}
          className={props.durationClassName}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          onEntered={() => props.setStep(1)}
        />
      </Transition>
    </>
  );
}

function SnackbarItem(
  props: SnackbarItemOptions & {
    onClose: () => void;
    children: React.ReactNode;
  }
) {
  return (
    <div className="antd-floating w-[350px]">
      <div className="flex items-center gap-3 p-3">
        <span
          className={cls(
            props.type === "success" &&
              tw.i_ri_checkbox_circle_fill.text_colorSuccess.text_2xl.$,
            props.type === "error" &&
              tw.i_ri_error_warning_fill.text_colorError.text_2xl.$
          )}
        />
        <div className="flex-1">{props.children}</div>
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
