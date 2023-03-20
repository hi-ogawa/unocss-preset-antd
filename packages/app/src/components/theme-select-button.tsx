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

export function ThemeSelectButton() {
  const [theme, setTheme] = useThemeState();
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
      }
    />
  );
}

// defined in <head><script>
declare let __themeStorageKey: string;

function useThemeState() {
  const [theme, setTheme] = useLocalStorage(__themeStorageKey, "system");
  const prefersDark = useMatchMedia("(prefers-color-scheme: dark)");

  const isDark =
    theme === "dark" || (theme === "system" && prefersDark.matches);

  React.useEffect(() => {
    runWithoutTransition(() => {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(isDark ? "dark" : "light");
    });
  }, [isDark]);

  return [theme, setTheme] as const;
}

function useLocalStorage(key: string, defaultValue: string) {
  const rerender = useRerender();

  function get() {
    return window.localStorage.getItem(key) || defaultValue;
  }

  function set(theme: string) {
    window.localStorage.setItem(key, theme);
    rerender();
  }

  return [get(), set] as const;
}

// TODO: utils-browser?
function runWithoutTransition(callback: () => void) {
  const el = document.createElement("style");
  el.innerHTML = `
    * {
      -webkit-transition: none !important;
      -moz-transition: none !important;
      -o-transition: none !important;
      -ms-transition: none !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(el);
  callback();
  // force paint
  tinyassert(window.getComputedStyle(document.documentElement).transition);
  document.head.removeChild(el);
}

// TODO: utils-react?
function useMatchMedia(query: string) {
  const result = React.useMemo(() => window.matchMedia(query), [query]);
  const rerender = useRerender();

  React.useEffect(() => {
    result.addEventListener("change", rerender);
    return () => result.removeEventListener("change", rerender);
  }, [result]);

  return result;
}

function useRerender() {
  return React.useReducer((prev) => !prev, false)[1];
}
