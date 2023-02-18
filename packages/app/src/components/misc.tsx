import { Transition } from "@headlessui/react";
import { tw } from "../styles/tw";
import { cls, useThemeState } from "../utils/misc";
import { Popover } from "./popover";

export function ThemeSelectButton() {
  const [theme, setTheme] = useThemeState();
  return (
    <Popover
      placement="bottom-end"
      reference={({ props, open, setOpen }) => (
        <button
          className="flex items-center antd-btn antd-btn-ghost"
          onClick={() => setOpen(!open)}
          {...props}
        >
          <span
            className={cls(
              theme === "dark" ? "i-ri-moon-line" : "i-ri-sun-line",
              "w-6 h-6"
            )}
          ></span>
        </button>
      )}
      floating={({ props, open }) => (
        <Transition
          show={open}
          className="transition duration-150 w-[200px]"
          enterFrom="scale-80 opacity-0"
          enterTo="scale-100 opacity-100"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-80 opacity-0"
          {...props}
        >
          <div className={tw.bg_colorBgElevated.shadow_2xl.$}>
            <ul className="flex flex-col gap-2 p-2">
              <li
                className={
                  tw.antd_btn.antd_btn_text.p_1.px_2.flex.items_center.gap_2.$
                }
                onClick={() => {
                  setTheme("system");
                }}
              >
                <span
                  className={cls(
                    tw.i_ri_check_line.w_5.h_5.$,
                    theme !== "system" && "invisible"
                  )}
                ></span>
                Use system theme
              </li>
              <li
                className={
                  tw.antd_btn.antd_btn_text.p_1.px_2.flex.items_center.gap_2.$
                }
                onClick={() => {
                  setTheme("dark");
                }}
              >
                <span
                  className={cls(
                    tw.i_ri_check_line.w_5.h_5.$,
                    theme !== "dark" && "invisible"
                  )}
                ></span>
                Dark theme
              </li>
              <li
                className={
                  tw.antd_btn.antd_btn_text.p_1.px_2.flex.items_center.gap_2.$
                }
                onClick={() => {
                  setTheme("light");
                }}
              >
                <span
                  className={cls(
                    tw.i_ri_check_line.w_5.h_5.$,
                    theme !== "light" && "invisible"
                  )}
                ></span>
                Light theme
              </li>
            </ul>
          </div>
        </Transition>
      )}
    />
  );
}
