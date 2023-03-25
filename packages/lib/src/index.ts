import fs from "node:fs";
import path from "node:path";
import { objectPickBy, typedBoolean } from "@hiogawa/utils";
import type { Theme } from "@unocss/preset-uno";
import type { Preset } from "unocss";
import { theme } from "./theme";
import { tw } from "./tw";

export function antdPreset(options?: { reset?: boolean }): Preset<Theme> {
  return {
    name: "antd-preset",
    prefix: "antd-",
    theme: {
      aria: {
        invalid: 'invalid="true"',
      },
      colors: objectPickBy(VARS, (_, k) => k.startsWith("color")),
      animation: {
        // builtin spin is not "composable" and cannot be used with `translate-xxx` etc... (https://github.com/unocss/unocss/blob/339f2b2c9be41a5505e7f4509eea1cf00a87a8d1/packages/preset-wind/src/theme.ts#L19)
        keyframes: {
          "spin-composable": `{
            from { transform: translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) rotate(0deg); }
            to   { transform: translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) rotate(360deg); }
          }`,
        },
        counts: {
          "spin-composable": "infinite",
        },
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

      // loading spinner
      spin: tw.animate_spin_composable.rounded_full.border_1.border_transparent
        .border_t_current.aspect_square.$,

      // modal, popover, snackbar, etc...
      floating: tw.bg_colorBgElevated._(`shadow-[${VARS.boxShadowSecondary}]`)
        .$,

      // a href
      link: tw.cursor_pointer.transition.text_colorLink.hover(
        tw.text_colorLinkHover
      ).$,

      /**
       * button https://github.com/ant-design/ant-design/blob/db5913696b5286b02701b7451bb34eebbe34b464/components/button/style/index.ts
       */
      btn: tw.cursor_pointer.transition.disabled(
        tw.cursor_not_allowed.opacity_50
      ).$,

      "btn-text": tw.not_disabled(
        // "hover" state on touch device can be confusing as it sticks even after the touch release.
        // This is critical, for example, when `antd-btn` is used as toggle.
        // Thus, such style is enabled only on "mouse" device (i.e. `(hover) and (pointer: fine)`).
        // Also, to get around with selector "specificity" issue, we need `:hover:not(:active)`.
        tw
          .hover(tw.not_active(tw.media_mouse(tw.bg_colorBgTextHover)))
          .active(tw.bg_colorBgTextActive)
      ).$,

      "btn-ghost": tw.not_disabled(
        tw
          .hover(tw.not_active(tw.media_mouse(tw.text_colorPrimaryHover)))
          .active(tw.text_colorPrimaryActive)
      ).$,

      "btn-default": tw.border.border_colorBorder.not_disabled(
        tw
          .hover(
            tw.not_active(
              tw.media_mouse(tw.text_colorPrimaryHover.border_colorPrimaryHover)
            )
          )
          .active(tw.text_colorPrimaryActive.border_colorPrimaryActive)
      ).$,

      "btn-primary": tw.text_white.bg_colorPrimary.not_disabled(
        tw
          .hover(tw.not_active(tw.media_mouse(tw.bg_colorPrimaryHover)))
          .active(tw.bg_colorPrimaryActive)
      ).$,

      "btn-loading": tw
        ._("relative")
        .after(
          tw._(
            "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          ).content_none.antd_spin.h_4
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

      /**
       * menu
       */
      "menu-item": "antd-btn antd-btn-text",
      "menu-item-active": tw.important(
        tw.text_colorPrimary
          ._(`bg-[${VARS.controlItemBgActive}]`)
          .dark(tw.text_white.bg_colorPrimary)
      ).$,
    },
    preflights: [
      (options?.reset ?? true) && {
        getCSS: () =>
          // TODO: esm?
          fs.promises.readFile(path.join(__dirname, "reset.css"), "utf-8"),
      },
    ].filter(typedBoolean),
  };
}

// VARS.colorText => "var(--antd-colorText)"
const VARS = Object.fromEntries(
  Object.keys(theme.default).map((k) => [k, `var(--antd-${k})`])
) as Record<keyof typeof theme.default, string>;

// export for `StoryColor` in packages/app/src/components/stories.tsx
export { VARS as ANTD_VERS };

function toCssVariables(
  tokens: Record<string, unknown>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => ["--antd-" + k, String(v)])
  );
}
