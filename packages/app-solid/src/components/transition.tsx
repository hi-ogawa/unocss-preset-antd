import {
  type TransitionCallbackProps,
  type TransitionClassProps,
  TransitionManager,
  TransitionManagerV2,
  convertClassPropsToCallbackProps,
} from "@hiogawa/tiny-transition";
import {
  type JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";

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
      <div
        ref={(el) => manager.ref(el)}
        class={props.class}
        style={props.style}
      >
        {props.children}
      </div>
    </Show>
  );
}
