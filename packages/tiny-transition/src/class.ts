import type { TransitionCallbackProps } from "./core";

// helper to use css class for callbacks

export const TRANSITION_CLASS_TYPES = [
  "enter",
  "enterFrom",
  "enterTo",
  "entered",
  "leave",
  "leaveFrom",
  "leaveTo",
] as const;

export type TransitionClassType = (typeof TRANSITION_CLASS_TYPES)[number];

export type TransitionClassProps = Partial<Record<TransitionClassType, string>>;

export function convertClassPropsToCallbackProps(
  base: string | undefined,
  props: TransitionClassProps & TransitionCallbackProps
): TransitionCallbackProps {
  const cl = {
    base: splitClass(base ?? ""),
    enter: splitClass(props.enter ?? ""),
    enterFrom: splitClass(props.enterFrom ?? ""),
    enterTo: splitClass(props.enterTo ?? ""),
    entered: splitClass(props.entered ?? ""),
    leave: splitClass(props.leave ?? ""),
    leaveFrom: splitClass(props.leaveFrom ?? ""),
    leaveTo: splitClass(props.leaveTo ?? ""),
  };
  const all = Object.values(cl).flat();

  // prettier-ignore
  return {
    onEnterFrom: (el) => {
      el.classList.remove(...all);
      el.classList.add(...cl.base, ...cl.enterFrom, ...cl.enter);
      props.onEnterFrom?.(el);
    },
    onEnterTo: (el) => {
      el.classList.remove(...all);
      el.classList.add(...cl.base, ...cl.enterTo, ...cl.enter);
      props.onEnterTo?.(el);
    },
    onEntered: (el) => {
      el.classList.remove(...all);
      el.classList.add(...cl.base, ...cl.enterTo, ...cl.entered);
      props.onEntered?.(el);
    },
    onLeaveFrom: (el) => {
      el.classList.remove(...all);
      el.classList.add(...cl.base, ...cl.leaveFrom, ...cl.leave);
      props.onLeaveFrom?.(el);
    },
    onLeaveTo: (el) => {
      el.classList.remove(...all);
      el.classList.add(...cl.base, ...cl.leaveTo, ...cl.leave);
      props.onLeaveTo?.(el);
    },
    onLeft: (el) => {
      el.classList.remove(...all);
      el.classList.add(...cl.base);
      props.onLeft?.(el);
    }
  };
}

function splitClass(c: string): string[] {
  return c.split(" ").filter(Boolean);
}
