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
    ),
    h(
      "button",
      {
        class: "antd-btn antd-btn-default px-2 capitalize",
        onClick: () => {
          toast.custom(({ h, toast, item }) =>
            h("div", { class: "flex items-center gap-2" }, [
              h("span", {
                class: "i-ri-aliens-fill text-colorPrimary text-2xl",
              }),
              h("span", {}, "Custom"),
              h("button", {
                class:
                  "antd-btn antd-btn-ghost i-ri-close-line text-colorTextSecondary text-lg",
                // TODO: collapsing in the middle of toast list not working?
                onClick: () => toast.dismiss(item.id),
              }),
            ])
          );
        },
      },
      "Custom"
    )
  );
}

main();
