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
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";

export function Transition(
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
      new TransitionManager(
        props.appear ? false : props.show,
        convertClassPropsToCallbackProps(props.class, props)
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
      <div ref={(el) => manager.ref(el)} style={props.style}>
        {props.children}
      </div>
    </Show>
  );
}
