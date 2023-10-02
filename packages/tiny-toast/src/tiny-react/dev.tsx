import { h, render } from "@hiogawa/tiny-react";
import { tinyassert } from "@hiogawa/utils";
import { XToastManager } from "./api";

const toast = new XToastManager();

function Demo() {
  return h.div(
    { className: "p-2 flex gap-2" },
    h.button(
      {
        className: "antd-btn antd-btn-default px-2",
        onclick: () => {
          toast.create(
            { type: "success", message: "Successfully toasted!" },
            { duration: 2000 }
          );
        },
      },
      "Success"
    ),
    h.button(
      {
        className: "antd-btn antd-btn-default px-2",
        onclick: () => {
          toast.create(
            { type: "error", message: "This didn't work." },
            { duration: 4000 }
          );
        },
      },
      "Error"
    ),
    h.button(
      {
        className: "antd-btn antd-btn-default px-2",
        onclick: () => {
          toast.create(
            { type: "info", message: "This may be a useful toast." },
            { duration: 4000 }
          );
        },
      },
      "Info"
    )
  );
}

function main() {
  const el = document.getElementById("root");
  tinyassert(el);
  el.innerHTML = "";
  render(h(Demo, {}), el);
  toast.render();
}

main();
