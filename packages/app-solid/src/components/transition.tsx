import {
  type TransitionCallbackProps,
  type TransitionClassProps,
  TransitionManager,
  TransitionManagerV2,
  convertClassPropsToCallbackProps,
} from "@hiogawa/tiny-transition";
import { once, tinyassert } from "@hiogawa/utils";
import {
  type JSX,
  Show,
  batch,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";
import { className as solidClassName, style as solidStyle } from "solid-js/web";

export function Transition(
  props: {
    show: boolean;
    appear?: boolean;
  } & TransitionClassProps &
    TransitionCallbackProps &
    Pick<JSX.HTMLElementTags["div"], "class" | "children" | "style">
) {
  const callbackOptions = createMemo(() =>
    convertClassPropsToCallbackProps(props)
  );

  const manager = new TransitionManager(
    untrack(() => ({
      defaultEntered: props.show && !props.appear,
      ...callbackOptions(),
    }))
  );

  const [shouldRender, setShouldRender] = createSignal(manager.shouldRender());

  createEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setShouldRender(manager.shouldRender());
    });
    onCleanup(() => unsubscribe());
  });

  createEffect(() => {
    manager.show(props.show ?? false);
  });

  createEffect(() => {
    Object.assign(manager.options, callbackOptions());
  });

  return (
    <Show when={shouldRender()}>
      <div
        ref={(el) => manager.setElement(el)}
        class={props.class}
        style={props.style}
      >
        {props.children}
      </div>
    </Show>
  );
}

export function TransitionV2(
  // prettier-ignore
  props: {
    show: boolean;
    appear?: boolean;
  } & TransitionClassProps
    & TransitionCallbackProps
    & Pick<JSX.HTMLElementTags["div"], "class" | "children" | "style">
) {
  const manager = untrack(
    () =>
      new TransitionManagerV2(
        props.appear ? false : props.show,
        convertClassPropsToCallbackProps(props)
      )
  );
  const [state, setState] = createSignal(manager.state);

  createEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setState(manager.state);
    });
    onCleanup(() => unsubscribe());
  });

  createEffect(() => {
    manager.set(props.show);
  });

  return (
    <Show when={state()}>
      <EffectWrapper manager={manager} class={props.class} style={props.style}>
        {props.children}
      </EffectWrapper>
      {/* <div
        // use:refHack={1}
        // use:refHack={2}
        ref={(el) => {
          // TODO: need to ensure class/style applied before manager.ref?
          // TODO: should move `manager.ref` to `createRenderEffect`?
          // if (props.class) {
          //   solidClassName(el, props.class);
          // }
          // if (props.style) {
          //   solidStyle(el, props.style as any);
          // }
          // untrack(() => {
          //   if (props.class) {
          //     solidClassName(el, props.class);
          //   }
          //   if (props.style) {
          //     solidStyle(el, props.style as any);
          //   }
          // });
          // console.log(el.className, el.style.cssText);
          // batch(() => manager.ref(el));
          // queueMicrotask(() => manager.ref(el));
          console.log("== ref");
          manager.ref(el);
        }}
        // class={() => {
        //   return props.class;
        // }}
        class={props.class}
        style={props.style}
        prop:__refHack={(() => {
          console.log("__refHack");
          return 0;
        })()}
      >
        {props.children}
      </div> */}
    </Show>
  );
}

// function refHack(el: Element, value: () => unknown) {
//   console.log("== refHack", value());
//   // const [field, setField] = value();
//   // createRenderEffect(() => (el.value = field()));
//   // el.addEventListener("input", (e) => setField(e.target.value));
// }

function EffectWrapper(
  props: { manager: TransitionManagerV2 } & Pick<
    JSX.HTMLElementTags["div"],
    "class" | "children" | "style"
  >
) {
  let ref!: HTMLElement;

  // need to delay `manager.ref` call from solid-js's own `ref` phase to  `createRenderEffect`.
  // this is because solid-js's `ref` runs before `class/style` props handling.
  // createRenderEffect(() => {
  //   tinyassert(ref);
  //   props.manager.ref(ref);
  // });

  onCleanup(() => {
    props.manager.ref(null);
  });

  return (
    <div
      ref={(el) => (ref = el)}
      class={props.class}
      style={props.style}
      // @ts-ignore
      prop:__TransitionManagerRefHack={once(() => {
        tinyassert(ref);
        props.manager.ref(ref);
      })()}
    >
      {props.children}
    </div>
  );
}
