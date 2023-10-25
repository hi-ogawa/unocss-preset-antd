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

  let workaroundNoAppear = manager.state && !props.appear;

  return (
    <Show when={state()}>
      <div
        // TODO: solidjs runs `ref` before assigning `class` which breaks transition?
        //       for some reason, `style` works fine and this is required for popover currently.
        // class={props.class}
        style={props.style}
        ref={(el) => {
          manager.ref(el);
          // since we cannot use `class` as explained above,
          // we workaround `show=true appear=false` by manual callback calls on mount
          if (workaroundNoAppear) {
            workaroundNoAppear = false;
            manager.callbacks?.onEntered?.(el);
          }
        }}
      >
        {props.children}
      </div>
    </Show>
  );
}
