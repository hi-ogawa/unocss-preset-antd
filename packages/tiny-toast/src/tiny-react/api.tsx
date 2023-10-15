import { Fragment, h, render } from "@hiogawa/tiny-react";
import type { ToastPosition, ToastType } from "../common";
import { type ToastItem, ToastManager } from "../core";
import { ToastContainer } from "./ui";

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
    render(h(ToastContainer, { toast: this }), el);
    return () => {
      render(h(Fragment, {}), el);
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
