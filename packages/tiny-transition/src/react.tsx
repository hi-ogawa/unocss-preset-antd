import { objectMapValues, objectOmit } from "@hiogawa/utils";
import { useMergeRefs, useStableCallback } from "@hiogawa/utils-react";
import * as React from "react";
import {
  TRANSITION_CLASS_TYPES,
  type TransitionClassProps,
  convertClassPropsToCallbackProps,
} from "./class";
import {
  TRANSITION_CALLBACK_TYPES,
  type TransitionCallbackProps,
  TransitionManager,
} from "./core";

export function useTransitionManager(
  value: boolean,
  options?: { appear?: boolean; callbacks?: TransitionCallbackProps }
) {
  const [manager] = React.useState(
    () =>
      new TransitionManager(options?.appear ? false : value, options?.callbacks)
  );

  React.useEffect(() => {
    manager.set(value);
  }, [value]);

  React.useSyncExternalStore(
    manager.subscribe,
    () => manager.state,
    () => manager.state
  );

  return manager;
}

export const Transition = simpleForawrdRef(function Transition(
  // prettier-ignore
  props: {
    show: boolean;
    appear?: boolean;
    render?: (props: Record<string, any>) => React.ReactNode;
    children?: React.ReactNode;
    // all props will be delegated to <div /> but we pick only two to reduce noisy auto-completion
    className?: string;
    style?: React.CSSProperties;
  } & TransitionClassProps
    & TransitionCallbackProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  // define stable callbacks with ref element
  const elRef = React.useRef<HTMLElement | null>(null);
  const callbacks = objectMapValues(
    convertClassPropsToCallbackProps(props.className, props),
    (callback) =>
      useStableCallback(() => {
        if (callback && elRef.current) {
          callback(elRef.current);
        }
      })
  );

  // transition manager
  const manager = useTransitionManager(props.show, {
    appear: props.appear,
    callbacks,
  });

  // render
  const mergedRefs = useMergeRefs(ref, elRef, manager.ref);
  const render = props.render ?? defaultRender;

  // TODO: render `props.entered/enterTo` class when `show=true` and `appear=false`
  return (
    manager.state &&
    render({
      ref: mergedRefs,
      ...objectOmit(props, [
        "show",
        "appear",
        "render",
        ...TRANSITION_CLASS_TYPES,
        ...TRANSITION_CALLBACK_TYPES,
      ]),
    })
  );
});

function defaultRender(props: any) {
  return React.createElement("div", props);
}

// simplify forwardRef typing for dts rollup
function simpleForawrdRef<
  P,
  T,
  F extends (props: P, ref: React.ForwardedRef<T>) => React.ReactNode
>(f: F): (props: P & { ref?: React.Ref<T> }) => React.ReactNode {
  return React.forwardRef(f) as any;
}
