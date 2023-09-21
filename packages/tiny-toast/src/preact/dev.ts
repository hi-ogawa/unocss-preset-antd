import "virtual:uno.css";
import { capitalize } from "@hiogawa/utils";
import { h, render } from "preact";
import { PreactToastManager } from "./api";

const toast = new PreactToastManager();

function main() {
  toast.render(document.getElementById("root-toast")!);
  render(h(Demo, {}), document.getElementById("root")!);
}

function Demo() {
  return h(
    "div",
    {
      class: "p-2 flex gap-2",
    },
    (["success", "error", "info", "blank"] as const).map((type) =>
      h(
        "button",
        {
          class: "antd-btn antd-btn-default px-2 capitalize",
          onClick: () => {
            toast[type](capitalize(type));
          },
        },
        type
      )
    )
  );
}

main();
