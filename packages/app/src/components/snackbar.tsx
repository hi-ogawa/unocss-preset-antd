import { Transition } from "@headlessui/react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { CollapseTransition } from "./collapse";
import {
  SnackbarItemOptions,
  SnackbarItemState,
  useSnackbar,
} from "./snackbar-hook";

export function SnackbarConainer() {
  const { items, dismiss, __update, remove } = useSnackbar();

  return (
    <div className="flex flex-col absolute bottom-1 left-2">
      {[...items].reverse().map((item) => (
        <SnackbarAnimation
          key={item.id}
          item={item}
          onDismiss={() => dismiss(item.id)}
          onDismiss2={() => __update(item.id, { state: "dismiss-collapse" })}
          onDismiss3={() => remove(item.id)}
        >
          <SnackbarItem
            type={item.options?.type}
            onClose={() => dismiss(item.id)}
          >
            {item.node}
          </SnackbarItem>
        </SnackbarAnimation>
      ))}
    </div>
  );
}

function SnackbarAnimation(
  props: React.PropsWithChildren<{
    item: SnackbarItemState;
    onDismiss: () => void;
    onDismiss2: () => void;
    onDismiss3: () => void;
  }>
) {
  const item = props.item;
  return (
    <>
      {/*  */}
      {/* collpase transition */}
      {/*  */}
      <CollapseTransition
        key={item.id}
        show={item.state === "show" || item.state === "dismiss-slide"}
        className="duration-300"
        afterLeave={() => props.onDismiss3()}
      >
        {/*  */}
        {/* slide transtion */}
        {/*  */}
        <Transition
          appear
          show={item.state === "show"}
          className="inline-block duration-500 transform py-1"
          enterFrom="translate-x-[-120%]"
          enterTo="translate-x-0"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-[-120%]"
          afterLeave={() => props.onDismiss2()}
        >
          {props.children}
        </Transition>
        {/*  */}
        {/* dummy transition to auto trigger slide-out after timeout */}
        {/*  */}
        <Transition
          appear
          show={item.state === "show"}
          className="duration-2000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          afterEnter={() => props.onDismiss()}
        />
      </CollapseTransition>
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
