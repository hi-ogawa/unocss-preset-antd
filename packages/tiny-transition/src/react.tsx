import { objectOmit } from "@hiogawa/utils";
import { useMergeRefs } from "@hiogawa/utils-react";
import React from "react";
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

export const ReactTransition = React.forwardRef(function ReactTransition(
  props: {
    show: boolean;
    appear?: boolean;
    render?: (props: Record<string, any>) => React.ReactNode;
  } & TransitionClassProps &
    TransitionCallbackProps & {
      // to rollup dts, we need to inline and simplify Pick<JSX.IntrinsicElements["div"], ...>
      className?: string | undefined;
      style?: unknown | undefined;
      children?: React.ReactNode;
    },
  ref: React.ForwardedRef<HTMLElement>
) {
  //
  // setup TransitionManager as external store
  //
  const [manager] = React.useState(
    () =>
      new TransitionManager({
        defaultEntered: Boolean(props.show && !props.appear),
        ...convertClassPropsToCallbackProps(props.className, props),
      })
  );
  React.useSyncExternalStore(manager.subscribe, manager.getSnapshot);

  //
  // sync props to state
  //
  React.useEffect(() => {
    manager.show(props.show ?? false);
  }, [props.show]);

  React.useEffect(() => {
    Object.assign(
      manager.options,
      convertClassPropsToCallbackProps(props.className, props)
    );
  }, [props]);

  //
  // render
  //
  const delegatedProps = objectOmit(props, [
    "show",
    "appear",
    "render",
    ...TRANSITION_CLASS_TYPES,
    ...TRANSITION_CALLBACK_TYPES,
  ]);
  const mergedRefs = useMergeRefs(ref, manager.setElement);
  const render = props.render ?? ((props: any) => <div {...props} />);

  return (
    <>
      {manager.shouldRender() &&
        render({
          ref: mergedRefs,
          ...delegatedProps,
        })}
    </>
  );
});
