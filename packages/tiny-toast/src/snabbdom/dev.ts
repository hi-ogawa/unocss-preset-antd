import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import { h } from "snabbdom";
import { SnabbdomToastManager } from "./api";
import { initRender } from "./utils";

const toast = new SnabbdomToastManager();

function main() {
  {
    const el = document.getElementById("root-toast");
    tinyassert(el);
    toast.init(el);
  }
  {
    const el = document.getElementById("root");
    tinyassert(el);
    const render = initRender(el, () => RenderDemo());
    render();
  }
}

function RenderDemo() {
  return h(
    "div",
    {
      attrs: {
        class: "p-2 flex gap-2",
      },
    },
    [
      h(
        "button",
        {
          attrs: {
            class: "antd-btn antd-btn-default px-1",
          },
          on: {
            click: () => {
              toast.create({ message: "hello" }, { duration: 4000 });
            },
          },
        },
        "hello"
      ),
      h(
        "button",
        {
          attrs: {
            class: "antd-btn antd-btn-default px-1",
          },
          on: {
            click: () => {
              toast.create({ message: "world" }, { duration: 4000 });
            },
          },
        },
        "world"
      ),
    ]
  );
}

main();
