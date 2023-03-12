import { Transition } from "@headlessui/react";
import { useStableRef } from "@hiogawa/utils-react";
import React from "react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";

// based on https://github.com/hi-ogawa/ytsub-v3/blob/859264f683e8d1c6331ca1c630101c037a78dd94/app/components/top-progress-bar.tsx#L1-L2

export function TopProgressBar({ loading }: { loading: boolean }) {
  const progress = useProgress(loading);

  return (
    <Transition
      show={typeof progress.value === "number"}
      // TODO: portal
      className={cls(tw.fixed.left_0.top_0.w_full.$)}
      leave="transition-opacity duration-250"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={
          tw.absolute.top_0._("h-[3px] opacity-60").bg_colorPrimary.w_full.$
        }
      />
      <div
        className={tw.absolute.top_0._("h-[3px]").bg_colorPrimary.w_full.$}
        style={{
          transformOrigin: "0 0",
          // TODO: can compute in css?
          transform: `scaleX(${progress.value ?? 0})`,
          // TODO: can compute in js?
          transitionProperty: progress.finishing ? "transform" : "none",
          transitionDuration: progress.finishing ? "500" : "0",
        }}
      />
    </Transition>
  );
}

interface UseProgressResult {
  value?: number; // \in [0, 1]
  finishing: boolean;
}

// export to debug in StoryTopProgressBar
export function useProgress(loading: boolean): UseProgressResult {
  const time = useRafTime(loading);
  const [finishing, setFinishing] = React.useState(false);
  const [setFinishingDelayed, setFinishingReset] =
    toDelayedSetState(setFinishing);
  const prevLoading = usePrevious(loading);

  React.useEffect(() => {
    if (loading) {
      setFinishing(false);
      setFinishingReset();
    }
    if (!loading && prevLoading) {
      setFinishing(true);
      setFinishingDelayed(false, 500);
    }
  }, [loading]);

  const value = finishing
    ? 1
    : typeof time === "number"
    ? computeProgress(time / 1000)
    : undefined;
  return { value, finishing };
}

function computeProgress(s: number): number {
  // partial sum of zeta function https://www.wolframalpha.com/input?i=zeta%281.5%29
  const x = 1.5;
  const z = 2.6;
  let y = 0;
  for (let i = 0; i < s; i++) {
    y += Math.min(s - i, 1) / (i + 1) ** x;
  }
  y /= z;
  return y;
}

//
// utils (TODO: move to utils-react)
//

export function toDelayedSetState<T>(
  setState: React.Dispatch<React.SetStateAction<T>>
) {
  const [subscribe, setSubscribe] = React.useState<() => () => void>();

  function setStateDelayed(value: React.SetStateAction<T>, ms: number) {
    setSubscribe(() => () => {
      const unsubscribe = setTimeout(() => {
        setState(value);
      }, ms);
      return () => {
        clearTimeout(unsubscribe);
      };
    });
  }

  function reset() {
    setSubscribe(undefined);
  }

  React.useEffect(() => subscribe?.(), [subscribe]);

  return [setStateDelayed, reset] as const;
}

function useRafTime(enabled: boolean) {
  const [time, setTime] = React.useState<number>();
  const [origin, setOrigin] = React.useState<number>();

  React.useEffect(() => {
    setTime(undefined);
    setOrigin(undefined);
  }, [enabled]);

  useRafLoop((next) => {
    if (!enabled) {
      return;
    }
    if (typeof next !== "number" || typeof origin !== "number") {
      setOrigin(next);
      setTime(0);
    } else {
      setTime((time) => (time ?? 0) + (next - origin));
    }
  });

  return enabled ? time : undefined;
}

// based on https://github.com/hi-ogawa/ytsub-v3/blob/859264f683e8d1c6331ca1c630101c037a78dd94/app/utils/hooks.ts#L6
function useRafLoop(callback: (time?: DOMHighResTimeStamp) => void): void {
  const callbackRef = useStableRef(callback);

  React.useEffect(() => {
    let id: number | undefined;
    function loop(time?: DOMHighResTimeStamp) {
      id = requestAnimationFrame(loop);
      callbackRef.current(time);
    }
    loop();
    return () => {
      if (typeof id === "number") {
        cancelAnimationFrame(id);
      }
    };
  }, []);
}

function usePrevious<T>(value: T): T {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
