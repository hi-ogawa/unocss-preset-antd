import { getTheme, setTheme } from "@hiogawa/theme-script";
import { tw } from "@hiogawa/unocss-ts";
import React from "react";
import { cls } from "../utils/misc";
import { PopoverSimple } from "./popover";

const THEME_OPTIONS = [
  ["system", "Use system theme"],
  ["dark", "Dark theme"],
  ["light", "Light theme"],
] as const;

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
                setTheme(t);
                rerender();
              }}
            >
              <span
                className={cls(
                  tw.i_ri_check_line.w_5.h_5.$,
                  t !== getTheme() && "invisible"
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
