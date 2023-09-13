import { FloatingPortal } from "@floating-ui/react";
import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { useDelay, usePrevious, useRafTime } from "@hiogawa/utils-react";
import React from "react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";

// based on https://github.com/hi-ogawa/ytsub-v3/blob/859264f683e8d1c6331ca1c630101c037a78dd94/app/components/top-progress-bar.tsx#L1-L2

export function TopProgressBar({ loading }: { loading: boolean }) {
  const progress = useProgress(loading);

  return (
    <FloatingPortal>
      <Transition
        show={typeof progress.value === "number"}
        className={cls(tw.fixed.left_0.top_0.w_full.$)}
        leave="transition-opacity duration-250"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={
            tw.absolute.top_0._("h-[3px] light:opacity-20 dark:opacity-50")
              .bg_colorPrimary.w_full.$
          }
        />
        <div
          className={
            tw.absolute.top_0._("h-[3px]").bg_colorPrimaryHover.w_full.$
          }
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
    </FloatingPortal>
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
  const resetFinishingDelayed = useDelay(() => setFinishing(false), 500);
  const prevLoading = usePrevious(loading);

  React.useEffect(() => {
    if (loading) {
      setFinishing(false);
      resetFinishingDelayed.cancel();
    }
    if (!loading && prevLoading) {
      setFinishing(true);
      resetFinishingDelayed();
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
  const x = 1.4;
  const z = 4;
  let y = 0;
  for (let i = 0; i < s; i++) {
    y += Math.min(s - i, 1) / (i + 1) ** x;
  }
  y /= z;
  return y;
}
