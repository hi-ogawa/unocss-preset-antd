import { createRoot, h, useCallback } from "@hiogawa/tiny-react";
import { tinyassert } from "@hiogawa/utils";
import { TOAST_POSITIONS } from "../common";
import { TinyReactToastManager } from "./api";

const toast = new TinyReactToastManager();

function Buttons() {
  return h.div(
    { className: "flex gap-2" },
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

function Root() {
  return h.div(
    {
      className: "flex flex-col gap-3 p-3 h-full mx-auto w-full max-w-5xl",
    },
    h.div(
      { className: "flex flex-col gap-3 border p-3" },
      h.div(
        {
          className: "flex flex-col gap-2",
        },
        h.span({ className: "text-colorTextSecondary text-sm" }, "Show toast"),
        h(Buttons, {})
      ),
      h.label(
        {
          className: "flex flex-col gap-2",
        },
        h.span({ className: "text-colorTextSecondary text-sm" }, "Position"),
        h.select(
          {
            className: "antd-input p-1",
            // ref to mimic defaultValue
            ref(el) {
              if (el) {
                el.value = toast.defaultOptions.position;
              }
            },
            oninput: (e) => {
              toast.defaultOptions.position = e.currentTarget.value as any;
            },
          },
          TOAST_POSITIONS.map((value) => h.option({ key: value, value }, value))
        )
      )
    ),
    h.div(
      {
        className: "flex-1 flex flex-col border p-2",
      },
      h.div({
        // force "position: absolute" in ToastContainer
        className: "flex-1 relative overflow-hidden ![&>div]:absolute",
        ref: useCallback((el) => {
          toast.render(el);
        }, []),
      })
    )
  );
}

function main() {
  const el = document.getElementById("root");
  tinyassert(el);
  el.textContent = "";
  createRoot(el).render(h(Root, {}));
}

main();
