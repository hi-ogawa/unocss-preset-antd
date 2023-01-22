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
        text-[var(--antd-colorPrimary)]
        hover:text-[var(--antd-colorPrimaryHover)]
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
        not-disabled:hover:bg-[var(--antd-colorBgTextHover)]
        not-disabled:active:bg-[var(--antd-colorBgTextActive)]
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
