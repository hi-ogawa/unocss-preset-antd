import { Transition } from "@headlessui/react";
import { tw } from "../styles/tw";
import { cls, useThemeState } from "../utils/misc";
import { Popover } from "./popover";

const THEME_OPTIONS = [
  ["system", "Use system theme"],
  ["dark", "Dark theme"],
  ["light", "Light theme"],
] as const;

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
          <span className="!w-6 !h-6 light:i-ri-sun-line dark:i-ri-moon-line"></span>
        </button>
      )}
      floating={({ props, open }) => (
        <Transition
          show={open}
          className="transition duration-150 w-[230px]"
          enterFrom="scale-80 opacity-0"
          enterTo="scale-100 opacity-100"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-80 opacity-0"
          {...props}
        >
          {/* TODO: add arrow. improve shadow */}
          <div className={tw.bg_colorBgElevated.shadow_lg.$}>
            <ul className="flex flex-col gap-2 p-2">
              {THEME_OPTIONS.map(([t, label]) => (
                <li
                  key={t}
                  className={
                    tw.antd_btn.antd_btn_text.p_1.px_2.flex.items_center.gap_2.$
                  }
                  onClick={() => {
                    setTheme(t);
                  }}
                >
                  <span
                    className={cls(
                      tw.i_ri_check_line.w_5.h_5.$,
                      t !== theme && "invisible"
                    )}
                  ></span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Transition>
      )}
    />
  );
}
