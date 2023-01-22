import type { Preset } from "unocss";
import { theme } from "./theme";

export function antdPreset(): Preset {
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
       * base style (e.g. body { --at-apply: "antd-body" })
       */
      body: `
        font-${VAR.fontFamily}
        bg-${VAR.colorBgContainer}
        text-${VAR.colorText}
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
        not-disabled:hover:text-[var(--antd-colorPrimaryHover)]
        not-disabled:active:text-[var(--antd-colorPrimaryActive)]
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

      /**
       * input
       */
      input: `
        outline-none
        transition
        bg-[var(--antd-colorBgContainer)] border border-[var(--antd-colorBorder)]
        disabled:(bg-[var(--antd-colorBgContainerDisabled)])
        not-disabled:hover:border-[var(--antd-colorPrimary)]
        not-disabled:focus:(border-[var(--antd-colorPrimary)] ring-2 ring-[var(--antd-colorPrimaryBorder)])
        aria-invalid:!border-[var(--antd-colorError)]
        aria-invalid:focus:(ring-2 ring-[var(--antd-colorErrorOutline)])
      `,

      /**
       * card
       */
      card: `
        border border-${VAR.colorBorderSecondary}
      `,

      /**
       * divider
       */
      divider: `
        border-t-1 border-t-${VAR.colorBorderSecondary}
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
