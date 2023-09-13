import "./styles";
import { tinyassert } from "@hiogawa/utils";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  const root = createRoot(el);
  let reactEl = <App />;
  if (window.location.hash.split("?")[1]?.includes("strict")) {
    reactEl = <React.StrictMode>{reactEl}</React.StrictMode>;
  }
  root.render(reactEl);
}

main();
