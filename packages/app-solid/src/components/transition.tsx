import {
  type TransitionCallbackProps,
  type TransitionClassProps,
  TransitionManager,
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
    convertClassPropsToCallbackProps(props.class, props)
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
      <div ref={(el) => manager.setElement(el)} style={props.style}>
        {props.children}
      </div>
    </Show>
  );
}
