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
} from "../core";
import { simpleForawrdRef } from "../react";
import {
  LaggedBoolean,
  type LaggedBooleanOptions,
  type LaggedBooleanState,
} from "./core";

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
        if (state === "leaveFrom") options.onLeaveFrom?.();
        if (state === "leaveTo") options.onLeaveTo?.();
        if (state === true) options.onLeft?.();
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
    duration: number;
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
  const state = useLaggedBoolean(props.show, {
    duration: props.duration,
    appear: props.appear,
    ...stableCallbackPropsWithRef,
  });

  // render
  const mergedRefs = useMergeRefs(ref, elRef);
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
