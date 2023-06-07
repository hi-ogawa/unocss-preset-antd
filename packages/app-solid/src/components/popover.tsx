import {
  ComputePositionReturn,
  Placement,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";
import { mapOption, tinyassert } from "@hiogawa/utils";
import { Ref } from "@solid-primitives/refs";
import {
  JSX,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";
import { Portal } from "solid-js/web";
import { onDocumentEvent } from "./utils";

type FloatingContext = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  floatingStyle: JSX.CSSProperties;
};

type FloatingRenderArg = {
  ctx: () => FloatingContext;
};

export function Popover(props: {
  placement: Placement;
  reference: (arg: FloatingRenderArg) => JSX.Element;
  floating: (arg: FloatingRenderArg) => JSX.Element;
}) {
  const [referenceRef, setReferenceRef] = createSignal<HTMLElement>();
  const [floatingRef, setFloatingRef] = createSignal<HTMLElement>();

  // signals
  const [open, onOpenChange] = createSignal(false);
  const [computePositionReturn, setComputePositionReturn] =
    createSignal<ComputePositionReturn>();

  // derive floating style
  const floatingStyle = createMemo<JSX.CSSProperties>(
    () => mapOption(computePositionReturn(), getFloatingStyle) ?? {}
  );

  // TODO: useFloating-like abstraction
  //   - input: referenceRef, floatingRef, middleware, placement, ...
  //   - output signals: floatingStyle, context, ...

  // TODO: arrow

  // TODO: useInteractions-like abstraction
  //   - useClick
  //   - useDismiss

  createEffect(() => {
    const referenceEl = referenceRef();
    const floatingEl = floatingRef();
    const placement = props.placement;

    if (referenceEl && floatingEl) {
      // port useFloating
      async function update() {
        tinyassert(referenceEl);
        tinyassert(floatingEl);
        // TODO: define as async resource?
        const result = await computePosition(referenceEl, floatingEl, {
          placement,
          middleware: [offset(8), flip(), shift()],
        });
        setComputePositionReturn(result);
      }
      const cleanup = autoUpdate(referenceEl, floatingEl, update);
      onCleanup(() => cleanup());

      // port useDismiss
      onDocumentEvent("pointerdown", (e) => {
        if (
          e.target instanceof Node &&
          !referenceEl.contains(e.target) &&
          !floatingEl.contains(e.target)
        ) {
          onOpenChange(false);
        }
      });
    }
  });

  // TODO: getter factory helper?
  const ctx: () => FloatingContext = () => ({
    open: open(),
    onOpenChange,
    floatingStyle: floatingStyle(),
  });

  return (
    <>
      <Ref ref={setReferenceRef}>{props.reference({ ctx })}</Ref>
      <Portal>
        <Ref ref={setFloatingRef}>{props.floating({ ctx })}</Ref>
      </Portal>
    </>
  );
}

function getFloatingStyle(result: ComputePositionReturn): JSX.CSSProperties {
  return {
    left: `${result.x}px`,
    top: `${result.y}px`,
    position: result.strategy,
  };
}
