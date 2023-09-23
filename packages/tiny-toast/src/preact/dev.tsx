import "virtual:uno.css";
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
    h(
      "button",
      {
        class: "antd-btn antd-btn-default px-2",
        onClick: () => {
          toast.success("Successfully toasted!");
        },
      },
      "Success"
    ),
    h(
      "button",
      {
        class: "antd-btn antd-btn-default px-2",
        onClick: () => {
          toast.error("This didn't work.");
        },
      },
      "Error"
    ),
    h(
      "button",
      {
        class: "antd-btn antd-btn-default px-2",
        onClick: () => {
          toast.info("This may be a useful toast.");
        },
      },
      "Info"
    ),
    h(
      "button",
      {
        class: "antd-btn antd-btn-default px-2",
        onClick: () => {
          toast.custom(
            `This toast is super big. I don't think anyone could eat it in one bite.\n\nIt's larger than you expected. You eat it but it does not seem to get smaller.`,
            { class: "max-w-[350px] whitespace-pre-line" }
          );
        },
      },
      "Multiline"
    ),
    h(
      "button",
      {
        class: "antd-btn antd-btn-default px-2 capitalize",
        onClick: () => {
          toast.custom(({ h, toast, item }) =>
            h("div", { class: "flex items-center gap-3 -mx-2" }, [
              h("span", {
                class: "i-ri-aliens-fill text-colorWarning text-2xl",
              }),
              h("span", {}, "Custom toast with dismiss button"),
              h("button", {
                class:
                  "antd-btn antd-btn-ghost i-ri-close-line text-colorTextSecondary text-lg",
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
