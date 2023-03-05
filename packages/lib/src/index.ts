import { booleanGuard } from "@hiogawa/utils";
import type { Theme } from "@unocss/preset-uno";
import { pickBy } from "lodash";
import type { Preset } from "unocss";
import { theme } from "./theme";
import { tw } from "./tw";

export function antdPreset(
  options: { noPreflight?: boolean } = {}
): Preset<Theme> {
  return {
    name: "antd-preset",
    prefix: "antd-",
    theme: {
      aria: {
        invalid: 'invalid="true"',
      },
      colors: pickBy(VARS, (_, k) => k.startsWith("color")),
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
      body: tw._(`font-[${VARS.fontFamily}]`).bg_colorBgContainer.text_colorText
        .$,

      // default border color e.g. for card, divider, etc...
      reset: tw.border_colorBorderSecondary.$,

      /**
       * misc
       */
      spin: tw.animate_spin.rounded_full.border_1.border_transparent
        .border_t_current.$,

      link: tw.cursor_pointer.transition.text_colorPrimary.hover(
        tw.text_colorPrimaryHover
      ).$,

      /**
       * button https://github.com/ant-design/ant-design/blob/db5913696b5286b02701b7451bb34eebbe34b464/components/button/style/index.ts
       */
      btn: tw.cursor_pointer.transition.disabled(
        tw.cursor_not_allowed.opacity_50
      ).$,

      "btn-text": tw.not_disabled(
        tw.hover(tw.bg_colorBgTextHover).active(tw.bg_colorBgTextActive)
      ).$,

      "btn-ghost": tw.not_disabled(
        tw.hover(tw.text_colorPrimaryHover).active(tw.text_colorPrimaryActive)
      ).$,

      "btn-default": tw.border.border_colorBorder.not_disabled(
        tw
          .hover(tw.text_colorPrimaryHover.border_colorPrimaryHover)
          .active(tw.text_colorPrimaryActive.border_colorPrimaryActive)
      ).$,

      "btn-primary": tw.text_white.bg_colorPrimary.not_disabled(
        tw.hover(tw.bg_colorPrimaryHover).active(tw.bg_colorPrimaryActive)
      ).$,

      /**
       * input
       */
      input:
        tw.transition.bg_colorBgContainer.outline_none.border_1.border_colorBorder
          .disabled(tw.bg_colorBgContainerDisabled)
          .not_disabled(
            tw
              .hover(tw.border_colorPrimary)
              .focus(tw.border_colorPrimary.ring_2.ring_colorPrimaryBorder)
          )
          .aria_invalid(
            tw
              .important(tw.border_colorError)
              .focus(tw.ring_2.ring_colorErrorBorder)
          ).$,

      /**
       * tab
       */
      tablist: tw.flex.border_b.$,
      tab: tw.transition.border_b_2.border_transparent.cursor_pointer
        .hover(tw.text_colorPrimaryHover.border_colorPrimaryHover)
        .aria_selected(tw.text_colorPrimary.border_colorPrimary).$,
    },
    preflights: [
      !options.noPreflight && {
        layer: "utilities",
        getCSS: () => DEFAULT_PREFLIGHT,
      },
    ].filter(booleanGuard),
  };
}

// VARS.colorText => "var(--antd-colorText)"
const VARS = Object.fromEntries(
  Object.keys(theme.default).map((k) => [k, `var(--antd-${k})`])
) as { [K in keyof typeof theme.default]: string }; // IDE cannot follow the definition if Record<keyof typeof theme.default, string>

function toCssVariables(
  tokens: Record<string, unknown>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => ["--antd-" + k, String(v)])
  );
}

const DEFAULT_PREFLIGHT = `\
:root {
  color-scheme: light;
  --at-apply: "antd-variables-default";
}

.dark {
  color-scheme: dark;
  --at-apply: "antd-variables-dark";
}

body {
  --at-apply: "antd-body";
}

*,
::before,
::after {
  --at-apply: "antd-reset";
}
`;
