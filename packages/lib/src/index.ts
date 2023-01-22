import type { Theme } from "@unocss/preset-uno";
import type { Preset } from "unocss";
import { theme } from "./theme";

export function antdPreset(): Preset<Theme> {
  return {
    name: "antd-preset",
    prefix: "antd-",
    theme: {
      aria: {
        invalid: 'invalid="true"',
      },
    },
    // prettier-ignore
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
       * base style e.g.
       *
          body {
            --at-apply: "antd-body";
          }
          *, ::before, ::after {
            --at-apply: "antd-reset";
          }
       *
       */
      "body": `
        font-${VAR.fontFamily}
        bg-${VAR.colorBgContainer}
        text-${VAR.colorText}
      `,
      // default border color e.g. for card, divider, etc...
      "reset": `
        border-${VAR.colorBorderSecondary}
      `,

      /**
       * misc
       */
      spin: `
        animate-spin
        rounded-full
        border-1 border-transparent border-t-current
      `,
      link: `
        cursor-pointer
        transition
        text-${VAR.colorPrimary}
        hover:text-${VAR.colorPrimaryHover}
      `,

      /**
       * button https://github.com/ant-design/ant-design/blob/db5913696b5286b02701b7451bb34eebbe34b464/components/button/style/index.ts
       */
      btn: `
        cursor-pointer
        transition
        disabled:(cursor-not-allowed opacity-50)
      `,
      "btn-text": `
        not-disabled:hover:bg-${VAR.colorBgTextHover}
        not-disabled:active:bg-${VAR.colorBgTextActive}
      `,
      "btn-ghost": `
        not-disabled:hover:text-${VAR.colorPrimaryHover}
        not-disabled:active:text-${VAR.colorPrimaryActive}
      `,
      "btn-default": `
        border border-${VAR.colorBorder}
        not-disabled:hover:(text-${VAR.colorPrimaryHover} border-${VAR.colorPrimaryHover})
        not-disabled:active:(text-${VAR.colorPrimaryActive} border-${VAR.colorPrimaryActive})
      `,
      "btn-primary": `
        text-white
        bg-${VAR.colorPrimary}
        not-disabled:hover:bg-${VAR.colorPrimaryHover}
        not-disabled:active:bg-${VAR.colorPrimaryActive}
      `,

      /**
       * input
       */
      input: `
        outline-none
        transition
        bg-${VAR.colorBgContainer} border border-${VAR.colorBorder}
        disabled:bg-${VAR.colorBgContainerDisabled}
        not-disabled:hover:border-${VAR.colorPrimary}
        not-disabled:focus:(border-${VAR.colorPrimary} ring-2 ring-${VAR.colorPrimaryBorder})
        aria-invalid:!border-${VAR.colorError}
        aria-invalid:focus:(ring-2 ring-${VAR.colorErrorOutline})
      `,
    },
  };
}

// shortcut authoring helper with IDE autocompletion e.g.
//   VARS.colorText => "[var(--antd-colorText)]"
// TODO: this cannot be used outside of "shortcuts" since scanner cannot resolve interpolation
export const VAR = Object.fromEntries(
  Object.keys(theme.default).map((k) => [k, `[var(--antd-${k})]`])
) as { [K in keyof typeof theme.default]: string }; // IDE cannot follow the definition if Record<keyof typeof theme.default, string>

function toCssVariables(
  tokens: Record<string, unknown>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => ["--antd-" + k, String(v)])
  );
}
