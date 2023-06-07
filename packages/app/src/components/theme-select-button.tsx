import { tinyassert } from "@hiogawa/utils";
import React from "react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { PopoverSimple } from "./popover";

const THEME_OPTIONS = [
  ["system", "Use system theme"],
  ["dark", "Dark theme"],
  ["light", "Light theme"],
] as const;

declare let __themeSet: (theme: string) => void;
declare let __themeGet: () => string;

export function ThemeSelectButton() {
  const [, rerender] = React.useReducer((prev) => !prev, true);

  return (
    <PopoverSimple
      placement="bottom-end"
      reference={
        <button className="flex items-center antd-btn antd-btn-ghost">
          <span className="!w-6 !h-6 light:i-ri-sun-line dark:i-ri-moon-line"></span>
        </button>
      }
      floating={
        <ul className="flex flex-col gap-2 p-2 w-[210px]">
          {THEME_OPTIONS.map(([t, label]) => (
            <li
              key={t}
              className={
                tw.antd_btn.antd_btn_text.p_1.px_2.flex.items_center.gap_2.$
              }
              onClick={() => {
                __themeSet(t);
                rerender();
              }}
            >
              <span
                className={cls(
                  tw.i_ri_check_line.w_5.h_5.$,
                  t !== __themeGet() && "invisible"
                )}
              ></span>
              {label}
            </li>
          ))}
        </ul>
      }
    />
  );
}

export function useThemeLinkIcon() {
  const matches = useMatchMedia("(prefers-color-scheme: dark)");

  React.useEffect(() => {
    // we can change icon color by patching svg data url (cf. packages/app/index.html)

    const el = document.querySelector("link[rel=icon]");
    tinyassert(el);

    let href = el.getAttribute("href");
    tinyassert(href);
    if (matches) {
      href = href.replace("black", "white");
    } else {
      href = href.replace("white", "black");
    }
    el.setAttribute("href", href);
  }, [matches]);
}

function useMatchMedia(query: string): boolean | undefined {
  const [value, setValue] = React.useState<boolean>();

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const handler = () => setValue(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return value;
}
