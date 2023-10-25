import { createRoot, h } from "@hiogawa/tiny-react";
import type { ToastPosition, ToastType } from "../common";
import { type ToastItem, ToastManager } from "../core";
import { ToastContainer } from "./ui";

// almost identical to preact
// not sure how would it be possible to share code

interface TinyToastData {
  message: RenderItem;
  type: ToastType;
  position: ToastPosition;
  className?: string;
  style?: string;
}

interface DefaultOptions {
  className?: string;
  style?: string;
  position: ToastPosition;
  duration: number;
}

type RenderItem = (props: {
  h: (...args: any[]) => unknown;
  item: TinyToastItem;
  toast: TinyReactToastManager;
}) => unknown;

type MaybeRenderItem = RenderItem | string;

export type TinyToastItem = ToastItem<TinyToastData>;

export class TinyReactToastManager extends ToastManager<TinyToastData> {
  public defaultOptions: DefaultOptions = {
    position: "top-center",
    duration: 4000,
  };

  render() {
    const el = document.createElement("div");
    el.setAttribute("data-tiny-toast", "");
    document.body.appendChild(el);
    const root = createRoot(el);
    root.render(h(ToastContainer, { toast: this }));
    return () => {
      root.unmount();
      el.remove();
    };
  }

  success = createByTypeFactory("success");
  error = createByTypeFactory("error");
  info = createByTypeFactory("info");
  custom = createByTypeFactory("custom");
}

function createByTypeFactory(type: ToastType) {
  return function (
    this: TinyReactToastManager,
    message: MaybeRenderItem,
    options?: Partial<DefaultOptions>
  ) {
    this.create(
      {
        message: typeof message === "function" ? message : () => message,
        type,
        position: options?.position ?? this.defaultOptions.position,
        className: options?.className ?? this.defaultOptions.className,
        style: options?.style ?? this.defaultOptions.style,
      },
      {
        duration:
          options?.duration ??
          this.defaultOptions.duration / (type === "success" ? 2 : 1),
      }
    );
  };
}
