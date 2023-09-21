import { h, render } from "preact";
import { useEffect, useReducer } from "preact/hooks";
import { TOAST_STEP, type ToastItem, ToastManager } from "../core";

export interface PreactToastData {
  message: string;
  // style?: CSSStyleDeclaration;
  // class?: string;
}

export type PreactToastItem = ToastItem<PreactToastData>;

export class PreactToastManager extends ToastManager<PreactToastData> {
  info(message: string) {
    this.create({ message }, { duration: 4000 });
  }

  render(el: Element) {
    render(h(ToastContainer, { toast: this }), el);
    return render(null, el);
  }
}

function ToastContainer({ toast }: { toast: PreactToastManager }) {
  // TODO: reduce ~2KB by rewriting it to class component without useReducer?
  const rerender = useReducer<boolean, void>((prev) => !prev, false)[1];

  useEffect(() => {
    const dispose = toast.subscribe(() => rerender());
    return () => dispose();
  }, []);

  return h(
    "div",
    {
      ref: () => {},
      class: "fixed inset-0 z-9999 pointer-events-none",
      onMouseEnter: () => {
        toast.pause(true);
      },
      onMouseLeave: () => {
        toast.pause(false);
      },
    },
    [
      h(
        "div",
        {
          class: "absolute top-3 flex flex-col-reverse items-center w-full",
        },
        toast.items.map((item) => ToastAnimation({ toast, item }))
      ),
    ]
  );
}

function ToastAnimation({
  toast,
  item,
}: {
  toast: PreactToastManager;
  item: PreactToastItem;
}) {
  useEffect(() => {
    if (item.step === TOAST_STEP.DISMISS) {
      toast.remove(item.id);
    }
  }, [item.step]);

  return h("div", {}, ToastItemComponent({ toast, item }));
}

function ToastItemComponent({
  item,
}: {
  toast: PreactToastManager;
  item: PreactToastItem;
}) {
  return h("div", { class: "pointer-events-auto rounded-lg shadow-lg" }, [
    h(
      "div",
      {
        class: "flex items-center p-3",
      },
      [
        h("span", {
          class: "i-ri-information-line text-blue text-2xl",
        }),
        h("div", { class: "px-2" }, item.data.message),
      ]
    ),
  ]);
}
