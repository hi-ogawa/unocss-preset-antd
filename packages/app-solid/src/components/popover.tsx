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
  Accessor,
  JSX,
  Setter,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";
import { Portal } from "solid-js/web";
import { onDocumentEvent } from "./utils";

type FloatingContext = {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  reference: Accessor<HTMLElement | undefined>;
  floating: Accessor<HTMLElement | undefined>;
  floatingStyle: Accessor<JSX.CSSProperties>;
};

export function Popover(props: {
  placement: Placement;
  reference: (ctx: FloatingContext) => JSX.Element;
  floating: (ctx: FloatingContext) => JSX.Element;
}) {
  // signals
  const [referenceRef, setReferenceRef] = createSignal<HTMLElement>();
  const [floatingRef, setFloatingRef] = createSignal<HTMLElement>();
  const [open, setOpen] = createSignal(false);

  const ctx = createFloating({
    reference: referenceRef,
    floating: floatingRef,
    open,
    setOpen,
    placement: () => props.placement,
    // TODO: arrow
    middleware: () => [offset(8), flip(), shift()],
  });

  createDismissInteraction(ctx);

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
  reference: Accessor<HTMLElement | undefined>;
  floating: Accessor<HTMLElement | undefined>;
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  placement: Accessor<ComputePositionConfig["placement"]>;
  middleware: Accessor<ComputePositionConfig["middleware"]>;
}): FloatingContext {
  const [result, setResult] = createSignal<ComputePositionReturn>();

  createEffect(() => {
    const reference = props.reference();
    const floating = props.floating();

    if (!reference || !floating) {
      setResult(undefined);
      return;
    }

    // setup auto update
    const placement = props.placement?.();
    const middleware = props.middleware?.();
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

  return {
    open: props.open,
    setOpen: props.setOpen,
    reference: props.reference,
    floating: props.floating,
    floatingStyle,
  };
}

function createDismissInteraction(ctx: FloatingContext) {
  // dismiss on click outside
  createEffect(() => {
    const reference = ctx.reference();
    const floating = ctx.floating();

    onDocumentEvent("pointerdown", (e) => {
      if (
        e.target instanceof Node &&
        !reference?.contains(e.target) &&
        !floating?.contains(e.target)
      ) {
        ctx.setOpen(false);
      }
    });
  });

  // dismiss on escape
  onDocumentEvent("keyup", (e) => {
    if (e.key === "Escape") {
      ctx.setOpen(false);
    }
  });
}

function createClickInteraction(ctx: FloatingContext) {
  createEffect(() => {
    const reference = ctx.reference();
    if (reference) {
      function callback() {
        ctx.setOpen((prev) => !prev);
      }
      reference.addEventListener("click", callback);
      onCleanup(() => {
        document.removeEventListener("click", callback);
      });
    }
  });
}

function getFloatingStyle(result: ComputePositionReturn): JSX.CSSProperties {
  return {
    left: `${result.x}px`,
    top: `${result.y}px`,
    position: result.strategy,
  };
}
