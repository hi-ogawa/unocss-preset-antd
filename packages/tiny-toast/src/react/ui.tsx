import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { groupBy, tinyassert } from "@hiogawa/utils";
import { useStableCallback } from "@hiogawa/utils-react";
import React from "react";
import { TOAST_STEP } from "../core";
import type {
  ReactToastContainerOptions,
  ReactToastItem,
  ReactToastManager,
} from "./api";

export function ReactToastContainer({
  toast,
  options,
}: {
  toast: ReactToastManager;
  options?: ReactToastContainerOptions;
}) {
  React.useSyncExternalStore(
    toast.subscribe,
    toast.getSnapshot,
    toast.getSnapshot
  );

  const itemsByPosition = React.useMemo(
    () => groupBy(toast.items, (item) => item.data.position),
    [toast.items]
  );

  const renderAnimation =
    options?.renderAnimation ?? ((props) => <AnimationWrapper {...props} />);

  const renderItem =
    options?.renderItem ?? ((props) => <ItemComponent {...props} />);

  return (
    <div>
      <div className="= flex flex-col absolute bottom-1 left-2">
        {itemsByPosition
          .get("bottom-left")
          ?.reverse()
          .map((item) => (
            <React.Fragment key={item.id}>
              {renderAnimation({
                toast,
                item,
                children: renderItem({ toast, item }),
              })}
            </React.Fragment>
          ))}
      </div>
      {/* reverse twice to correct z-order */}
      <div className="= flex flex-col-reverse absolute top-1 items-center w-full">
        {itemsByPosition
          .get("top-center")
          ?.reverse()
          .map((item) => (
            <React.Fragment key={item.id}>
              {renderAnimation({
                toast,
                item,
                children: renderItem({ toast, item }),
              })}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

function AnimationWrapper({
  item,
  toast,
  children,
}: {
  item: ReactToastItem;
  toast: ReactToastManager;
  children?: React.ReactNode;
}) {
  // TODO: implement without @hiogawa/tiny-transition?

  // steps
  // 0. slide in + scale up
  // 1. slide out + scale down + collapse down
  return (
    <Transition
      show={item.step < TOAST_STEP.DISMISS}
      className="= duration-300"
      onLeaveFrom={(el) => {
        tinyassert(el.firstElementChild);
        el.style.height = el.firstElementChild.clientHeight + "px";
      }}
      onLeaveTo={(el) => {
        el.style.height = "0px";
      }}
      onLeft={() => toast.remove(item.id)}
    >
      <Transition
        appear
        show={item.step < TOAST_STEP.DISMISS}
        className="= inline-block duration-300 transform py-1"
        enterFrom={cls(
          "= scale-0 opacity-10",
          item.data.position === "bottom-left" && "= translate-y-[120%]",
          item.data.position === "top-center" && "= translate-y-[-120%]"
        )}
        enterTo="= translate-y-0 scale-100 opacity-100"
        leaveFrom="= translate-y-0 scale-100 opacity-100"
        leaveTo={cls(
          "= scale-0 opacity-10",
          item.data.position === "bottom-left" && "= translate-y-[120%]",
          item.data.position === "top-center" && "= translate-y-[-120%]"
        )}
      >
        {children}
      </Transition>
    </Transition>
  );
}

function ItemComponent({
  item,
  toast,
}: {
  item: ReactToastItem;
  toast: ReactToastManager;
}) {
  // pause auto-dismiss timeout on hover
  const [pause, setPause] = React.useState(false);

  // auto-dismiss timeout
  useTimeout(
    () => toast.dismiss(item.id),
    pause ? Infinity : item.data.duration
  );

  return (
    <div
      // box-shadow from https://github.com/timolins/react-hot-toast/blob/1713dd3598ee5b746ccc9c66750d6f53394e58f1/src/components/toast-bar.tsx#L28
      className="= shadow-[0_3px_10px_rgba(0,_0,_0,_0.1),_0_3px_3px_rgba(0,_0,_0,_0.05)]"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <div className="= flex items-center gap-3 p-3">
        {item.data.type && (
          <span
            className={cls(
              item.data.type === "success" &&
                "= i-ri-checkbox-circle-fill text-[#52c41a] text-2xl",
              item.data.type === "error" &&
                "= i-ri-alert-fill text-[#ff4b4b] text-2xl",
              item.data.type === "info" && "= i-ri-information-line text-2xl"
            )}
          />
        )}
        <div className="= flex-1">{item.data.node}</div>
      </div>
    </div>
  );
}

function useTimeout(f: () => void, ms: number) {
  f = useStableCallback(f);

  React.useEffect(() => {
    if (ms === Infinity) {
      return;
    }
    const t = window.setTimeout(() => f(), ms);
    return () => {
      window.clearTimeout(t);
    };
  }, [ms]);
}

function cls(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}
