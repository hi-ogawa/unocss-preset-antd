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
  reference: HTMLElement | undefined;
  floating: HTMLElement | undefined;
};

export function Popover(props: {
  placement: Placement;
  reference: (ctx: FloatingContext) => JSX.Element;
  floating: (ctx: FloatingContext) => JSX.Element;
}) {
  const [referenceRef, setReferenceRef] = createSignal<HTMLElement>();
  const [floatingRef, setFloatingRef] = createSignal<HTMLElement>();

  // signals
  const [open, onOpenChange] = createSignal(false);
  const [computePositionReturn, setComputePositionReturn] =
    createSignal<ComputePositionReturn>();

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
    } else {
      // TODO: not supposed to set signal in effect?
      setComputePositionReturn(undefined);
    }
  });

  // derive floating style
  const floatingStyle = createMemo<JSX.CSSProperties>(
    () => mapOption(computePositionReturn(), getFloatingStyle) ?? {}
  );

  const ctx: FloatingContext = combineAccessors({
    open,
    onOpenChange: () => onOpenChange,
    floatingStyle,
    reference: referenceRef,
    floating: floatingRef,
  });

  return (
    <>
      <Ref ref={setReferenceRef}>{props.reference(ctx)}</Ref>
      <Portal>
        <Ref ref={setFloatingRef}>{props.floating(ctx)}</Ref>
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

// reverse of `destructure` https://github.com/solidjs-community/solid-primitives/blob/876b583ed95e0c3f0a552882f3508a07fc64fca4/packages/destructure/src/index.ts
function combineAccessors<T extends Record<string, () => unknown>>(
  accessors: T
): CombineAccessorsResult<T> {
  return new Proxy(
    {},
    {
      get: (_target, p, _receiver) => accessors[p as keyof T](),
    }
  ) as any;
}

type CombineAccessorsResult<T extends Record<string, () => unknown>> = {
  [K in keyof T]: ReturnType<T[K]>;
};
