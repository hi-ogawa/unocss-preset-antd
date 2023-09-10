import {
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";
import {
  TransitionCallbacks,
  TransitionClassProps,
  TransitionManager,
  processClassProps,
} from "./transition-utils";

export function Transition(
  props: {
    show: boolean;
    appear?: boolean;
  } & TransitionClassProps &
    TransitionCallbacks &
    Pick<JSX.HTMLElementTags["div"], "children" | "style">
) {
  const callbackOptions = createMemo(() => processClassProps(props));

  const manager = new TransitionManager(
    untrack(() => ({
      initialEntered: props.show && !props.appear,
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
