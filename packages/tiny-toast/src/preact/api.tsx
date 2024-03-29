import { type ComponentChild, type VNode, h, render } from "preact";
import type { ToastPosition, ToastType } from "../common";
import { type ToastItem, ToastManager } from "../core";
import { ToastContainer } from "./ui";

// only for dev to quickly compare with tiny-react

type RenderItem = (props: {
  h: typeof h;
  item: PreactToastItem;
  toast: PreactToastManager;
}) => ComponentChild;

type MaybeRenderItem = RenderItem | VNode | string;

interface PreactToastData {
  render: RenderItem;
  type: ToastType;
  position: ToastPosition;
  style?: string;
  class?: string;
}

interface DefaultOptions {
  class?: string;
  style?: string;
  position: ToastPosition;
  duration: number;
}

export type PreactToastItem = ToastItem<PreactToastData>;

export class PreactToastManager extends ToastManager<PreactToastData> {
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
      render(null, el);
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
    this: PreactToastManager,
    render: MaybeRenderItem,
    options?: Partial<DefaultOptions>
  ) {
    this.create(
      {
        render: typeof render === "function" ? render : () => render,
        type,
        position: options?.position ?? this.defaultOptions.position,
        class: options?.class ?? this.defaultOptions.class,
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
