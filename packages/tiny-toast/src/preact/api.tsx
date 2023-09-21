import { type ComponentChild, h, render } from "preact";
import type { ToastType } from "../common";
import { type ToastItem, ToastManager } from "../core";
import { ToastContainer } from "./ui";

type RenderItem = (props: {
  h: typeof h;
  item: PreactToastItem;
  toast: PreactToastManager;
}) => ComponentChild;

type MaybeRenderItem = RenderItem | Exclude<ComponentChild, object>;

interface PreactToastData {
  render: RenderItem;
  type: ToastType;
  style?: string;
  class?: string;
}

export type PreactToastItem = ToastItem<PreactToastData>;

export class PreactToastManager extends ToastManager<PreactToastData> {
  render(el: Element) {
    render(h(ToastContainer, { toast: this }), el);
    return () => render(null, el);
  }

  success = createByTypeFactory("success");
  error = createByTypeFactory("error");
  info = createByTypeFactory("info");
  blank = createByTypeFactory("blank");
  custom = createByTypeFactory("custom");
}

function createByTypeFactory(type: ToastType) {
  return function (this: PreactToastManager, render: MaybeRenderItem) {
    this.create(
      {
        render: typeof render === "function" ? render : () => render,
        type,
      },
      {
        duration: 4000,
      }
    );
  };
}
