import { objectMapValues, objectOmit } from "@hiogawa/utils";
import { useMergeRefs, useStableCallback } from "@hiogawa/utils-react";
import {
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
} from "../class";
import {
  TRANSITION_CALLBACK_TYPES,
  type TransitionCallbackProps,
  type TransitionCallbackType,
  computeTransitionTimeout,
} from "../core";
import { simpleForawrdRef } from "../react";
import {
  LaggedBoolean,
  type LaggedBooleanOptions,
  type LaggedBooleanState,
} from "./core";
import { TransitionManagerV2 } from "./v2";

export function useTransitionManagerV2(
  value: boolean,
  options?: { appear?: boolean }
) {
  const [manager] = useState(() => new TransitionManagerV2(value, options));

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

export function useLaggedBoolean(
  value: boolean,
  options: LaggedBooleanOptions &
    Partial<Record<TransitionCallbackType, () => void>>
): LaggedBooleanState {
  const [manager] = useState(() => new LaggedBoolean(value, options));

  useEffect(() => {
    manager.set(value);
  }, [value]);

  return useSyncExternalStore(
    useCallback((listener) => {
      // implement state callback outside of core.
      // we don't use `useEffect` deps since it would be clumsy to deal with StrictMode double effect.
      return manager.subscribe(() => {
        const state = manager.get();
        if (state === false) options.onLeft?.();
        if (state === "enterFrom") options.onEnterFrom?.();
        if (state === "enterTo") options.onEnterTo?.();
        if (state === true) options.onEntered?.();
        if (state === "leaveFrom") options.onLeaveFrom?.();
        if (state === "leaveTo") options.onLeaveTo?.();
        listener();
      });
    }, []),
    manager.get,
    manager.get
  );
}

export const TransitionV2 = simpleForawrdRef(function TransitionV2(
  props: {
    show: boolean;
    appear?: boolean;
    render?: (props: Record<string, any>) => React.ReactNode;
  } & TransitionClassProps &
    TransitionCallbackProps & {
      // choose only common props from `JSX.IntrinsicElements["div"]` to simplify auto-complete
      className?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
    },
  ref: React.ForwardedRef<HTMLElement>
) {
  // deifne stable callbacks with ref element
  const elRef = useRef<HTMLElement | null>(null);
  const callbackProps = convertClassPropsToCallbackProps(
    props.className,
    props
  );
  const stableCallbackPropsWithRef = objectMapValues(
    callbackProps,
    (callback) =>
      useStableCallback(() => {
        if (callback && elRef.current) {
          callback(elRef.current);
        }
      })
  );

  // lagged state
  const durationRef = useRef(0);
  const state = useLaggedBoolean(props.show, {
    get duration() {
      return durationRef.current;
    },
    appear: props.appear,
    ...stableCallbackPropsWithRef,
  });

  const mergedRefs = useMergeRefs(ref, elRef, (el: HTMLElement | null) => {
    if (el) {
      // hacky way to deal with `onEnterFrom`
      // since "enterFrom" event comes before we render dom...
      callbackProps.onEnterFrom?.(el);

      // derive timeout duration
      // (note that this "force styles" so it must be called after "onEnterFrom")
      durationRef.current = computeTransitionTimeout(el);
    }
  });
  const render = props.render ?? defaultRender;

  return (
    <>
      {state &&
        render({
          ref: mergedRefs,
          ...objectOmit(props, [
            "show",
            "appear",
            "render",
            ...TRANSITION_CLASS_TYPES,
            ...TRANSITION_CALLBACK_TYPES,
          ]),
        })}
    </>
  );
});

function defaultRender(props: any) {
  return <div {...props} />;
}
