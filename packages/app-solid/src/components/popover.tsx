import {
  ComputePositionConfig,
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

// TODO: arrow
export function Popover(props: {
  placement: Placement;
  reference: (ctx: FloatingContext) => JSX.Element;
  floating: (ctx: FloatingContext) => JSX.Element;
}) {
  const [referenceRef, setReferenceRef] = createSignal<HTMLElement>();
  const [floatingRef, setFloatingRef] = createSignal<HTMLElement>();

  // signals
  const [open, onOpenChange] = createSignal(false);

  // useFloating
  const ctx = createFloating({
    reference: referenceRef,
    floating: floatingRef,
    open,
    onOpenChange,
    placement: () => props.placement,
    middleware: () => [offset(8), flip(), shift()],
  });

  // useDismiss
  createDismissInteraction(ctx);

  // useClick
  createClickInteraction(ctx);

  return (
    <>
      <Ref ref={setReferenceRef}>{props.reference(ctx)}</Ref>
      <Portal>
        <Ref ref={setFloatingRef}>{props.floating(ctx)}</Ref>
      </Portal>
    </>
  );
}

function createFloating(props: {
  reference: () => HTMLElement | undefined;
  floating: () => HTMLElement | undefined;
  open: () => boolean;
  onOpenChange: (open: boolean) => void;
  placement?: () => ComputePositionConfig["placement"];
  middleware?: () => ComputePositionConfig["middleware"];
}): FloatingContext {
  const [result, setResult] = createSignal<ComputePositionReturn>();

  createEffect(() => {
    const reference = props.reference();
    const floating = props.floating();
    const placement = props.placement?.();
    const middleware = props.middleware?.();

    if (!reference || !floating) {
      setResult(undefined);
      return;
    }

    // setup auto update
    async function update() {
      tinyassert(reference);
      tinyassert(floating);
      const result = await computePosition(reference, floating, {
        placement,
        middleware,
      });
      setResult(result);
    }
    const cleanup = autoUpdate(reference, floating, update);
    onCleanup(() => cleanup());
  });

  // derive floating style
  const floatingStyle = createMemo<JSX.CSSProperties>(
    () => mapOption(result(), getFloatingStyle) ?? {}
  );

  return accessorsToGetters({
    open: props.open,
    onOpenChange: () => props.onOpenChange,
    floatingStyle,
    reference: props.reference,
    floating: props.floating,
  });
}

function createDismissInteraction(ctx: FloatingContext) {
  createEffect(() => {
    const reference = ctx.reference;
    const floating = ctx.floating;
    onDocumentEvent("pointerdown", (e) => {
      if (
        e.target instanceof Node &&
        !reference?.contains(e.target) &&
        !floating?.contains(e.target)
      ) {
        ctx.onOpenChange(false);
      }
    });
  });
}

function createClickInteraction(ctx: FloatingContext) {
  // TODO
  ctx;
}

function getFloatingStyle(result: ComputePositionReturn): JSX.CSSProperties {
  return {
    left: `${result.x}px`,
    top: `${result.y}px`,
    position: result.strategy,
  };
}

// reverse of `destructure` https://github.com/solidjs-community/solid-primitives/blob/876b583ed95e0c3f0a552882f3508a07fc64fca4/packages/destructure/src/index.ts
function accessorsToGetters<T extends Record<string, () => unknown>>(
  accessors: T
): AccessorsToGettersResult<T> {
  return new Proxy(
    {},
    {
      get: (_target, p, _receiver) => accessors[p as keyof T](),
    }
  ) as any;
}

type AccessorsToGettersResult<T extends Record<string, () => unknown>> = {
  [K in keyof T]: ReturnType<T[K]>;
};
