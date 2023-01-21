import type { Preset } from "unocss";
import { theme } from "./theme";

export function antdPreset(): Preset {
  return {
    name: "antd-preset",
    prefix: "antd-",
    shortcuts: {
      /**
       * pass theme variables via shortcuts, which can be used e.g. by
       *
          :root {
            --at-apply: "antd-variables-default";
          }
          .dark {
            --at-apply: "antd-variables-dark";
          }
       *
       */
      "variables-default": [toCssVariables(theme.default)],
      "variables-dark": [toCssVariables(theme.dark)],
      "variables-compact": [toCssVariables(theme.compact)],

      /**
       * base style (e.g. body { --at-apply: "antd-body" })
       */
      body: `
        font-[var(--antd-fontFamily)]
        bg-[var(--antd-colorBgContainer)]
        text-[var(--antd-colorText)]
      `,

      /**
       * components
       */
      spinner: `
        animate-spin
        rounded-full
        border-2 border-gray-500 border-t-gray-300 border-l-gray-300
      `,
      link: `
        cursor-pointer
        transition
        text-[var(--antd-colorPrimary)]
        hover:text-[var(--antd-colorPrimaryHover)]
      `,
      btn: `
        cursor-pointer
        transition
        disabled:(cursor-not-allowed opacity-50)
      `,
      "btn-ghost": `
        not-disabled:hover:(text-[var(--antd-colorPrimaryHover)])
        not-disabled:active:(text-[var(--antd-colorPrimaryActive)])
      `,
      "btn-default": `
        border border-[var(--antd-colorBorder)]
        not-disabled:hover:(text-[var(--antd-colorPrimaryHover)] border-[var(--antd-colorPrimaryHover)])
        not-disabled:active:(text-[var(--antd-colorPrimaryActive)] border-[var(--antd-colorPrimaryActive)])
      `,
      "btn-primary": `
        text-white
        bg-[var(--antd-colorPrimary)]
        not-disabled:hover:bg-[var(--antd-colorPrimaryHover)]
        not-disabled:active:bg-[var(--antd-colorPrimaryActive)]
      `,
    },
  };
}

function toCssVariables(
  tokens: Record<string, unknown>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => ["--antd-" + k, String(v)])
  );
}
