import {
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
} from "@floating-ui/react";
import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { tinyassert } from "@hiogawa/utils";
import type React from "react";

export function Drawer(props: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { refs, context } = useFloating({
    open: props.open,
    onOpenChange: (open) => {
      tinyassert(!open); // should get only `open = false` via `useDismiss`
      props.onClose();
    },
  });
  const { getFloatingProps } = useInteractions([useDismiss(context)]);
  const id = useId();

  return (
    <FloatingPortal id={id}>
      <Transition
        show={props.open}
        className="fixed inset-0 duration-300 z-[100]"
      >
        {/* backdrop */}
        <Transition
          appear
          show={props.open}
          className="transition duration-300 fixed inset-0 bg-black"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        />
        {/* content */}
        <FloatingOverlay lockScroll>
          <Transition
            appear
            show={props.open}
            className="transition duration-300 transform inline-block h-full bg-colorBgContainer shadow-lg"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-[0]"
            leaveFrom="translate-x-[0]"
            leaveTo="translate-x-[-100%]"
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                className: "inline-block h-full",
              })}
            >
              {props.children}
            </div>
          </Transition>
        </FloatingOverlay>
      </Transition>
    </FloatingPortal>
  );
}
