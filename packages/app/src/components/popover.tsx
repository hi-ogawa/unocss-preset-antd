import {
  FloatingContext,
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
import React from "react";
import { cls } from "../utils/misc";
import { Transition2 } from "./transition";

interface PopoverRenderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  props: Record<string, unknown>;
  arrowProps?: Record<string, unknown>;
  context: FloatingContext; // context.placement is an actual placement e.g. after `flip` middleware is applied
}

export function Popover(props: {
  placement: Placement;
  reference: (renderProps: PopoverRenderProps) => React.ReactNode;
  floating: (renderProps: PopoverRenderProps) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const arrowRef = React.useRef<Element>(null);

  // `floatingStyle` lags a moment and breaks animation?
  const { refs, x, y, strategy, context, middlewareData } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: props.placement,
    middleware: [
      offset(17),
      flip(),
      shift(),
      arrow({ element: arrowRef, padding: 10 }),
    ],
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
          ref: refs.setReference,
        }),
        context,
      })}
      <FloatingPortal id={id}>
        {props.floating({
          open,
          setOpen,
          props: getFloatingProps({
            ref: refs.setFloating,
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
          context,
        })}
      </FloatingPortal>
    </>
  );
}

//
// simple wrapper with transition
//

// https://ant.design/components/popover
export function PopoverSimple({
  placement,
  reference,
  floating,
}: {
  placement: Placement;
  reference: MaybeCallable<React.ReactElement, [FloatingContext]>;
  floating: MaybeCallable<React.ReactElement, [FloatingContext]>;
}) {
  return (
    <Popover
      placement={placement}
      reference={({ props, context }) =>
        React.cloneElement(maybeCall(reference, [context]), props)
      }
      floating={({ props, open, arrowProps, context }) => (
        <Transition2
          show={open}
          className="transition duration-150"
          enterFrom="scale-80 opacity-0"
          enterTo="scale-100 opacity-100"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-80 opacity-0"
          {...props}
        >
          <div className="antd-floating">
            {arrowProps && (
              <Arrow placement={context.placement} arrowProps={arrowProps} />
            )}
            {maybeCall(floating, [context])}
          </div>
        </Transition2>
      )}
    />
  );
}

// `FloatingArrow` from @floating-ui/react is not used since the shadow didn't look right.
function Arrow({
  arrowProps,
  placement,
}: {
  arrowProps: {}; // cheat forwarded ref
  placement: Placement;
}) {
  return (
    <div
      {...arrowProps}
      className={cls(
        placement.startsWith("bottom") && "top-0",
        placement.startsWith("top") && "bottom-0",
        placement.startsWith("left") && "right-0",
        placement.startsWith("right") && "left-0"
      )}
    >
      <div
        // rotate 4x4 square with shadow
        className={cls(
          "antd-floating !shadow-[var(--antd-boxShadowPopoverArrow)] relative w-4 h-4",
          placement.startsWith("bottom") && "-top-2 rotate-[225deg]",
          placement.startsWith("top") && "-bottom-2 rotate-[45deg]",
          placement.startsWith("left") && "-right-2 rotate-[315deg]",
          placement.startsWith("right") && "-left-2 rotate-[135deg]"
        )}
        // clip half
        style={{
          clipPath: "polygon(100% 0%, 200% 100%, 100% 200%, 0% 100%)",
        }}
      />
    </div>
  );
}

//
// misc
//

type MaybeCallable<T, Args extends any[]> = T | ((...args: Args) => T);

function maybeCall<T, Args extends any[]>(
  f: MaybeCallable<T, Args>,
  args: Args
): T {
  return typeof f === "function" ? (f as any)(...args) : f;
}
