import { h, render } from "@hiogawa/tiny-react";
import { tinyassert } from "@hiogawa/utils";
import { TinyToastManager } from "./api";

const toast = new TinyToastManager();

function Demo() {
  return h.div(
    { className: "p-2 flex gap-2" },
    h.button(
      {
        className: "antd-btn antd-btn-default px-2",
        onclick: () => {
          toast.success("Successfully toasted!");
        },
      },
      "Success"
    ),
    h.button(
      {
        className: "antd-btn antd-btn-default px-2",
        onclick: () => {
          toast.error("This didn't work.");
        },
      },
      "Error"
    ),
    h.button(
      {
        className: "antd-btn antd-btn-default px-2",
        onclick: () => {
          toast.info("This may be a useful toast.");
        },
      },
      "Info"
    ),
    h.button(
      {
        className: "antd-btn antd-btn-default px-2",
        onclick: () => {
          toast.custom(
            `This toast is super big. I don't think anyone could eat it in one bite.\n\nIt's larger than you expected. You eat it but it does not seem to get smaller.`,
            { className: "max-w-[350px] whitespace-pre-line" }
          );
        },
      },
      "Multiline"
    ),
    h.button(
      {
        className: "antd-btn antd-btn-default px-2 capitalize",
        onclick: () => {
          toast.custom(({ h, toast, item }) =>
            h(
              "div",
              { className: "flex items-center gap-3 -mx-2" },
              h("span", {
                className: "i-ri-aliens-fill text-colorWarning text-2xl",
              }),
              h("span", {}, "Custom toast with dismiss button"),
              h("button", {
                className:
                  "antd-btn antd-btn-ghost i-ri-close-line text-colorTextSecondary text-lg",
                onclick: () => toast.dismiss(item.id),
              })
            )
          );
        },
      },
      "Custom"
    )
  );
}

function main() {
  const el = document.getElementById("root");
  tinyassert(el);
  el.textContent = "";
  render(h(Demo, {}), el);
  toast.render();
}

main();
