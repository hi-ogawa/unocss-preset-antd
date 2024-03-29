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
import React from "react";
import { cls } from "../utils/misc";

// copied from https://github.com/hi-ogawa/web-ext-tab-manager/blame/81710dead04859525b9c8be3a73a71926cae6da4/src/components/modal.tsx

function Modal(props: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // override modal content container style e.g. max width/height
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
        appear
        show={props.open}
        className="fixed inset-0 duration-300 z-100"
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
        <FloatingOverlay
          lockScroll
          className="flex justify-center items-center"
        >
          <Transition
            appear
            show={props.open}
            className={cls(
              props.className,
              "transition duration-300 transform w-[90%] max-w-[700px] h-[90%] max-h-[500px] bg-colorBgContainer shadow-lg"
            )}
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                className: "w-full h-full",
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

// wrapper component hook
export function useModal() {
  const [open, setOpen] = React.useState(false);

  // pass stable ref to Wrapper
  const openRef = React.useRef(open);
  openRef.current = open;

  const [Wrapper] = React.useState(
    () =>
      function Wrapper(
        props: Omit<React.ComponentProps<typeof Modal>, "open" | "onClose">
      ) {
        return (
          <Modal
            open={openRef.current}
            onClose={() => setOpen(false)}
            {...props}
          />
        );
      }
  );

  return {
    open,
    setOpen,
    Wrapper,
  };
}
