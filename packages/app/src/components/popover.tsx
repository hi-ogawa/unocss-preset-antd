import {
  FloatingPortal,
  Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
} from "@floating-ui/react";
import { Transition } from "@headlessui/react";
import React from "react";

interface PopoverRenderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  props: {};
  arrowProps?: {};
}

export function Popover(props: {
  placement: Placement;
  reference: (renderProps: PopoverRenderProps) => React.ReactNode;
  floating: (renderProps: PopoverRenderProps) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const arrowRef = React.useRef<Element>(null);

  const { reference, floating, context, x, y, strategy, middlewareData } =
    useFloating({
      open,
      onOpenChange: setOpen,
      placement: props.placement,
      middleware: [
        offset(17),
        flip(),
        shift(),
        arrow({ element: arrowRef, padding: 10 }),
      ].filter(Boolean),
      whileElementsMounted: autoUpdate,
    });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  const id = useId();

  return (
    <>
      {props.reference({
        open,
        setOpen,
        props: getReferenceProps({
          ref: reference,
        }),
      })}
      <FloatingPortal id={id}>
        {props.floating({
          open,
          setOpen,
          props: getFloatingProps({
            ref: floating,
            style: {
              top: y ?? "",
              left: x ?? "",
              position: strategy,
            },
          }),
          arrowProps: {
            ref: arrowRef,
            style: {
              top: middlewareData.arrow?.y ?? "",
              left: middlewareData.arrow?.x ?? "",
              position: "absolute",
            },
          },
        })}
      </FloatingPortal>
    </>
  );
}

// https://ant.design/components/popover
export function PopoverSimple({
  placement,
  reference,
  floating,
}: {
  placement: Placement;
  reference: React.ReactElement;
  floating: React.ReactElement;
}) {
  return (
    <Popover
      placement={placement}
      reference={({ props, open, setOpen }) =>
        React.cloneElement(reference, {
          onClick: () => setOpen(!open),
          ...props,
        })
      }
      floating={({ props, open, arrowProps }) => (
        <Transition
          show={open}
          className="transition duration-150"
          enterFrom="scale-80 opacity-0"
          enterTo="scale-100 opacity-100"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-80 opacity-0"
          {...props}
        >
          <div className="bg-colorBgElevated shadow-[var(--antd-boxShadowSecondary)]">
            {/* TODO: support placement other than "bottom"? */}
            <div {...arrowProps}>
              <div
                // rotate rectangle with shadow
                className="bg-colorBgElevated shadow-[var(--antd-boxShadowPopoverArrow)] relative -top-2 w-4 h-4 rotate-[225deg]"
                style={{
                  // clip only lower half
                  clipPath: "polygon(100% 0%, 200% 100%, 100% 200%, 0% 100%)",
                }}
              ></div>
            </div>
            {floating}
          </div>
        </Transition>
      )}
    />
  );
}
