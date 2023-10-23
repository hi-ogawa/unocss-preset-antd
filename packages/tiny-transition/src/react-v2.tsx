import { objectMapValues, objectOmit } from "@hiogawa/utils";
import { useMergeRefs, useStableCallback } from "@hiogawa/utils-react";
import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  TRANSITION_CLASS_TYPES,
  type TransitionClassProps,
  convertClassPropsToCallbackProps,
} from "./class";
import {
  TRANSITION_CALLBACK_TYPES,
  type TransitionCallbackProps,
} from "./core";
import { TransitionManagerV2 } from "./core-v2";

export function useTransitionManager(
  value: boolean,
  options?: { appear?: boolean }
) {
  const [manager] = useState(
    () => new TransitionManagerV2(options?.appear ? !value : value)
  );

  useEffect(() => {
    manager.set(value);
  }, [value]);

  useSyncExternalStore(
    manager.subscribe,
    () => manager.state,
    () => manager.state
  );

  return manager;
}

// cheat typing to simplify dts rollup
function simpleForawrdRef<
  P,
  T,
  F extends (props: P, ref: React.ForwardedRef<T>) => React.ReactNode
>(f: F): (props: P & { ref?: React.Ref<T> }) => React.ReactNode {
  return forwardRef(f) as any;
}

export const TransitionV2 = simpleForawrdRef(function TransitionV2(
  // prettier-ignore
  props: {
    show: boolean;
    appear?: boolean;
    render?: (props: Record<string, any>) => React.ReactNode;
    // choose only common props from `JSX.IntrinsicElements["div"]` to simplify auto-complete
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  } & TransitionClassProps
    & TransitionCallbackProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  //
  // define stable callbacks with ref element
  //
  const elRef = useRef<HTMLElement | null>(null);
  const callbacks = objectMapValues(
    convertClassPropsToCallbackProps(props.className, props),
    (callback) =>
      useStableCallback(() => {
        if (callback && elRef.current) {
          callback(elRef.current);
        }
      })
  );

  //
  // transition manager
  //
  const [manager] = useState(
    () => new TransitionManagerV2(props.appear ? !props.show : props.show)
  );

  // TODO: move callback logic to core?
  useSyncExternalStore(
    useCallback((listener) => {
      // implement state callback outside of core.
      // we don't use `useEffect` deps since it would be clumsy to deal with StrictMode double effect.
      return manager.subscribe(() => {
        const state = manager.state;
        if (state === false) callbacks.onLeft?.();
        if (state === "enterFrom") callbacks.onEnterFrom?.();
        if (state === "enterTo") callbacks.onEnterTo?.();
        if (state === true) callbacks.onEntered?.();
        if (state === "leaveFrom") callbacks.onLeaveFrom?.();
        if (state === "leaveTo") callbacks.onLeaveTo?.();
        listener();
      });
    }, []),
    () => manager.state,
    () => manager.state
  );

  useEffect(() => {
    manager.set(props.show);
  }, [props.show]);

  //
  // render
  //
  const mergedRefs = useMergeRefs(ref, elRef, manager.ref);
  const render = props.render ?? defaultRender;

  if (!manager.state) {
    return null;
  }

  return render({
    ref: mergedRefs,
    ...objectOmit(props, [
      "show",
      "appear",
      "render",
      ...TRANSITION_CLASS_TYPES,
      ...TRANSITION_CALLBACK_TYPES,
    ]),
  });
});

function defaultRender(props: any) {
  return createElement("div", props);
}
