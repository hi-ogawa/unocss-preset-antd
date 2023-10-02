import { Fragment, h, render } from "@hiogawa/tiny-react";
import type { ToastType } from "../common"; // TODO: export VNode etc...
import { type ToastItem, ToastManager } from "../core";
import { ToastContainer } from "./ui";

interface XToastData {
  message: string;
  type: ToastType;
}

export type XToastItem = ToastItem<XToastData>;

export class XToastManager extends ToastManager<XToastData> {
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
}
