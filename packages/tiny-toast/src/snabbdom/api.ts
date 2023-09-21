import { h } from "snabbdom";
import { TOAST_STEP, type ToastItem, ToastManager } from "../core";
import { initRender } from "./utils";

export interface SnabbdomToastData {
  message: string;
  style?: CSSStyleDeclaration;
  class?: string;
}

export type SnabbdomToastItem = ToastItem<SnabbdomToastData>;

export class SnabbdomToastManager extends ToastManager<SnabbdomToastData> {
  show() {}

  init(el: Element) {
    const render = initRender(el, () => RenderContainer({ toast: this }));
    render();
    return this.subscribe(() => render());
  }
}

//
// ui
//

function RenderContainer({ toast }: { toast: SnabbdomToastManager }) {
  return h("div", {}, [
    h(
      "div",
      {},
      toast.items.map((item) => RenderAnimation({ toast, item }))
    ),
  ]);
}

function RenderAnimation({
  toast,
  item,
}: {
  toast: SnabbdomToastManager;
  item: SnabbdomToastItem;
}) {
  return h(
    "div",
    {
      hook: {
        update: () => {
          if (item.step === TOAST_STEP.DISMISS) {
            toast.remove(item.id);
          }
        },
      },
    },
    RenderItem({ toast, item })
  );
}

function RenderItem({
  toast,
  item,
}: {
  toast: SnabbdomToastManager;
  item: SnabbdomToastItem;
}) {
  toast;
  item;
  return h("div", {}, item.data.message);
}
