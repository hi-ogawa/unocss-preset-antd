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
    [
      h(
        "button",
        {
          class: "antd-btn antd-btn-default px-1",
          onClick: () => {
            toast.info("hello");
          },
        },
        "hello"
      ),
      h(
        "button",
        {
          class: "antd-btn antd-btn-default px-1",
          onClick: () => {
            toast.info("world");
          },
        },
        "world"
      ),
    ]
  );
}

main();
