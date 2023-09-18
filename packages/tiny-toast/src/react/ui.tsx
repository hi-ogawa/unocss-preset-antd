import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { groupBy } from "@hiogawa/utils";
import React from "react";
import { TOAST_STEP } from "../core";
import { cls, createPauseableTimeout } from "../utils";
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

  const render = (item: ReactToastItem) => (
    <React.Fragment key={item.id}>
      {renderAnimation({
        toast,
        item,
        children: renderItem({ toast, item }),
      })}
    </React.Fragment>
  );

  return (
    <div
      style={options?.style}
      className={cls(
        options?.className,
        "= fixed inset-0 z-9999 pointer-events-none"
      )}
      onMouseEnter={() => toast.pause(true)}
      onMouseLeave={() => toast.pause(false)}
    >
      <style
        // injected by misc/inject-css.mjs at build time
        dangerouslySetInnerHTML={{ __html: `/*__INJECT_CSS__*/` }}
      />
      {/* note that AnimationWrapper's py-1 gives uniform gap */}
      <div className="= [&_*]:pointer-events-auto absolute bottom-1 left-2 flex flex-col">
        {itemsByPosition.get("bottom-left")?.map((item) => render(item))}
      </div>
      <div className="= [&_*]:pointer-events-auto absolute top-1 flex flex-col-reverse items-center w-full">
        {itemsByPosition.get("top-center")?.map((item) => render(item))}
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
  // TODO: can implement without @hiogawa/tiny-transition?

  // steps
  // 0. slide in + scale up
  // 1. slide out + scale down + collapse down
  return (
    <Transition
      appear
      show={item.step < TOAST_STEP.DISMISS}
      className="= duration-300"
      onLeft={() => toast.remove(item.id)}
      {...getCollapseProps()}
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

// cf. packages/app/src/components/collapse.tsx
function getCollapseProps(): Partial<React.ComponentProps<typeof Transition>> {
  function uncollapse(el: HTMLElement) {
    if (el.firstElementChild) {
      el.style.height = el.firstElementChild.clientHeight + "px";
    }
  }

  function collapse(el: HTMLElement) {
    el.style.height = "0px";
  }

  function reset(el: HTMLElement) {
    el.style.height = "";
  }

  return {
    onEnterFrom: collapse,
    onEnterTo: uncollapse,
    onEntered: reset,
    onLeaveFrom: uncollapse,
    onLeaveTo: collapse,
  };
}

function ItemComponent({
  item,
  toast,
}: {
  item: ReactToastItem;
  toast: ReactToastManager;
}) {
  // auto-dismiss timeout
  // TODO: move to core

  const [timeout] = React.useState(() => {
    const timeout = createPauseableTimeout(
      () => toast.dismiss(item.id),
      item.data.duration
    );
    return timeout;
  });

  // cannot dispose since React.StrictMode would break it...
  React.useEffect(() => {
    timeout.start();
    return () => {
      timeout.stop();
    };
  }, []);

  React.useEffect(() => {
    if (toast.paused) {
      timeout.stop();
    } else {
      timeout.start();
    }
  }, [toast.paused]);

  return (
    <div
      style={item.data.style}
      className={cls(item.data.className, "= shadow-lg")}
    >
      <div className="= flex items-center gap-3 p-3">
        {item.data.type && (
          <span
            className={cls(
              item.data.type === "success" &&
                "= i-ri-checkbox-circle-fill text-green text-2xl",
              item.data.type === "error" &&
                "= i-ri-alert-fill text-red text-2xl",
              item.data.type === "info" && "= i-ri-information-line text-2xl"
            )}
          />
        )}
        <div className="= flex-1">{item.data.node}</div>
      </div>
    </div>
  );
}
