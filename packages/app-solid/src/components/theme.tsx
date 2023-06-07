import { tinyassert } from "@hiogawa/utils";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { SelectWrapper } from "./select";

// injected by global theme-script
declare let __themeSet: (theme: string) => void;
declare let __themeGet: () => string;

export function ThemeSelect() {
  return (
    <label class="flex items-center gap-2">
      <span>Theme</span>
      <SelectWrapper
        class="antd-input p-1 py-0.5 capitalize"
        options={["system", "dark", "light"]}
        // very subtle nuance but it's not necessary to make `value` reactive by createSignal/createEffect
        // since `select.value` can be left "uncontrolled" after the first rendering.
        value={__themeGet()}
        onChange={(v) => __themeSet(v)}
      />
    </label>
  );
}

export function changeLinkIconByTheme() {
  const matches = createMatchMedia("(prefers-color-scheme: dark)");

  createEffect(() => {
    const el = document.querySelector("link[rel=icon]");
    tinyassert(el);

    if (matches()) {
      el.setAttribute("href", el.getAttribute("data-href-dark")!);
    } else {
      el.setAttribute("href", el.getAttribute("data-href-light")!);
    }
  });
}

function createMatchMedia(query: string) {
  const [matches, setMatches] = createSignal<boolean>();

  const media = window.matchMedia(query);

  const handler = () => setMatches(media.matches);
  media.addEventListener("change", handler);
  onCleanup(() => media.removeEventListener("change", handler));

  createEffect(() => handler());

  return matches;
}
