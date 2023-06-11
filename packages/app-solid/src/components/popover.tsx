import {
  ComputePositionConfig,
  ComputePositionReturn,
  Middleware,
  MiddlewareData,
  Placement,
  arrow,
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
  untrack,
} from "solid-js";
import { Portal } from "solid-js/web";
import { cls, onDocumentEvent } from "./utils";

type FloatingContext = {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  reference: Accessor<HTMLElement | undefined>;
  floating: Accessor<HTMLElement | undefined>;
  floatingStyle: Accessor<JSX.CSSProperties | undefined>;
  placement: Accessor<Placement | undefined>; // actual placement e.g. after layout by flip middleware
  middlewareData: Accessor<MiddlewareData | undefined>;
};

type ArrowContext = {
  ref: Setter<HTMLElement | undefined>;
  style: Accessor<JSX.CSSProperties>;
};

export function Popover(props: {
  placement: Placement;
  reference: (arg: { ctx: FloatingContext }) => JSX.Element;
  floating: (arg: {
    ctx: FloatingContext;
    arrowCtx: ArrowContext;
  }) => JSX.Element;
}) {
  const [referenceRef, setReferenceRef] = createSignal<HTMLElement>();
  const [floatingRef, setFloatingRef] = createSignal<HTMLElement>();
  const [arrowRef, setArrowRef] = createSignal<HTMLElement>();
  const [open, setOpen] = createSignal(false);

  const ctx = createFloating({
    reference: referenceRef,
    floating: floatingRef,
    open,
    setOpen,
    placement: () => props.placement,
    middleware: () => [
      offset(17),
      flip(),
      shift(),
      arrowLazy({ element: () => untrack(arrowRef), padding: 10 }),
    ],
  });

  createDismissInteraction(ctx);
  createClickInteraction(ctx);

  // further derive for arrow
  const arrowStyle = createMemo<JSX.CSSProperties>(() => ({
    position: "absolute",
    top: mapOption(ctx.middlewareData()?.arrow?.y, (v) => `${v}px`),
    left: mapOption(ctx.middlewareData()?.arrow?.x, (v) => `${v}px`),
  }));

  const arrowCtx: ArrowContext = {
    ref: setArrowRef,
    style: arrowStyle,
  };

  return (
    <>
      <Ref ref={setReferenceRef}>{props.reference({ ctx })}</Ref>
      <Portal>
        <Ref ref={setFloatingRef}>{props.floating({ ctx, arrowCtx })}</Ref>
      </Portal>
    </>
  );
}

export function FloatingArrow(
  props: { placement: Placement } & JSX.HTMLElementTags["div"]
) {
  return (
    <div
      style={props.style}
      class={cls(
        props.placement.startsWith("bottom") && "top-0",
        props.placement.startsWith("top") && "bottom-0",
        props.placement.startsWith("left") && "right-0",
        props.placement.startsWith("right") && "left-0"
      )}
    >
      <div
        // rotate 4x4 square with shadow
        class={cls(
          "antd-floating !shadow-[var(--antd-boxShadowPopoverArrow)] relative w-4 h-4",
          props.placement.startsWith("bottom") && "-top-2 rotate-[225deg]",
          props.placement.startsWith("top") && "-bottom-2 rotate-[45deg]",
          props.placement.startsWith("left") && "-right-2 rotate-[315deg]",
          props.placement.startsWith("right") && "-left-2 rotate-[135deg]"
        )}
        // clip half
        style={{
          "clip-path": "polygon(100% 0%, 200% 100%, 100% 200%, 0% 100%)",
        }}
      />
    </div>
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

  return {
    open: props.open,
    setOpen: props.setOpen,
    reference: props.reference,
    floating: props.floating,
    floatingStyle: () => mapOption(result(), getFloatingStyle),
    placement: () => result()?.placement,
    middlewareData: () => result()?.middlewareData,
  };
}

// accept arrow element lazily like react https://github.com/floating-ui/floating-ui/blob/947b4d5aadd59d40f4add43700483818ee55a96f/packages/react-dom/src/arrow.ts#L16
function arrowLazy(options: {
  element?: Accessor<Element | undefined>;
  padding?: number;
}): Middleware {
  return {
    name: "arrow",
    options,
    fn(args) {
      const element = options.element?.();
      if (element) {
        return arrow({ ...options, element }).fn(args);
      }
      return {};
    },
  };
}

export function createDismissInteraction(
  ctx: Pick<FloatingContext, "reference" | "floating" | "setOpen">
) {
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

function createClickInteraction(
  ctx: Pick<FloatingContext, "reference" | "setOpen">
) {
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
