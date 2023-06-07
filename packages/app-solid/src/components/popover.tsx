import {
  Placement,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";
import { tinyassert } from "@hiogawa/utils";
import { Ref } from "@solid-primitives/refs";
import { JSX, createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

type FloatingContext = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FloatingRenderArg = {
  context: () => FloatingContext;
};

export function Popover(props: {
  placement: Placement;
  reference: (arg: FloatingRenderArg) => JSX.Element;
  floating: (arg: FloatingRenderArg) => JSX.Element;
}) {
  const [referenceRef, setReferenceRef] = createSignal<HTMLElement>();
  const [floatingRef, setFloatingRef] = createSignal<HTMLElement>();
  const [open, onOpenChange] = createSignal(false);

  const context: () => FloatingContext = () => ({
    open: open(),
    onOpenChange,
  });

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
      async function update() {
        tinyassert(referenceEl);
        tinyassert(floatingEl);
        const result = await computePosition(referenceEl, floatingEl, {
          placement,
          middleware: [offset(8), flip(), shift()],
        });
        // TODO: can we pass as signal?
        const floatingStyle: JSX.CSSProperties = {
          left: `${result.x}px`,
          top: `${result.y}px`,
          position: result.strategy,
        };
        Object.assign(floatingEl.style, floatingStyle);
      }
      const cleanup = autoUpdate(referenceEl, floatingEl, update);
      onCleanup(() => cleanup());
    }
  });

  return (
    <>
      <Ref ref={setReferenceRef}>{props.reference({ context })}</Ref>
      <Portal>
        <Ref ref={setFloatingRef}>{props.floating({ context })}</Ref>
      </Portal>
    </>
  );
}
