import { objectEntries, objectMapValues, objectPickBy } from "@hiogawa/utils";
import type { Preset } from "unocss";
import { name as packageName } from "../package.json";
import { theme } from "./theme";
import { tw } from "./tw";

export function unocssPresetAntd(): Preset {
  return {
    name: packageName,
    prefix: "antd-",
    theme: {
      aria: {
        invalid: 'invalid="true"',
      },
      colors: objectPickBy(ANTD_VARS, (_, k) => k.startsWith("color")),
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
       * misc
       */

      // loading spinner
      spin: tw.animate_spin_composable.rounded_full.border_1.border_transparent
        .border_t_current.aspect_square.$,

      // modal, popover, snackbar, etc...
      floating: tw.bg_colorBgElevated._(
        `shadow-[${ANTD_VARS.boxShadowSecondary}]`
      ).$,

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

      "btn-loading": tw.relative.after(
        tw.absolute.content_empty.antd_spin.h_4._(
          "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        )
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
          ._(`bg-[${ANTD_VARS.controlItemBgActive}]`)
          .dark(tw.text_white.bg_colorPrimary)
      ).$,
    },
    preflights: [
      {
        getCSS: () => getResetCSS(),
      },
    ],
  };
}

// ANTD_VARS.colorText => "var(--antd-colorText)"
export const ANTD_VARS = objectMapValues(
  theme.default,
  (_v, k) => `var(--antd-${k})`
);

function inlintCssVars(
  tokens: Record<string, unknown>,
  indent: number
): string {
  const pre = " ".repeat(indent);
  return objectEntries(tokens)
    .map(([k, v]) => `${pre}--antd-${k}: ${String(v)};\n`)
    .join("");
}

// defined by tsup.config.ts
declare let __DEFINE_RAW__: {
  "@unocss/reset/tailwind.css": string;
};

function getResetCSS() {
  return `
/********************************************************************/
/* [START] @unocss/reset/tailwind.css bundled by unocss-preset-antd */
/*******************************************************************/

${__DEFINE_RAW__["@unocss/reset/tailwind.css"]}

/******************************************************************/
/* [END] @unocss/reset/tailwind.css bundled by unocss-preset-antd */
/******************************************************************/

/************************************/
/* [START] unocss-preset-antd reset */
/************************************/

:root {
  color-scheme: light;
${inlintCssVars(theme.default, 2)}
}

.dark {
  color-scheme: dark;
${inlintCssVars(theme.dark, 2)}
}

body {
  font-family: ${ANTD_VARS.fontFamily};
  background-color: ${ANTD_VARS.colorBgContainer};
  color: ${ANTD_VARS.colorText};
}

*,
::before,
::after {
  border-color: ${ANTD_VARS.colorBorderSecondary};
}

/**********************************/
/* [END] unocss-preset-antd reset */
/**********************************/
`;
}
