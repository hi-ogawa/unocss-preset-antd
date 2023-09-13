import { antdPreset } from "@hiogawa/unocss-preset-antd";
import {
  dummyPreset,
  dummyPresetIconsRules,
  dummyRule,
  filterColorPallete,
  transformerTypescriptDsl,
} from "@hiogawa/unocss-typescript-dsl";
import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  theme: {
    aria: {
      "current-page": 'current="page"',
    },
  },
  presets: [
    antdPreset({ reset: false }), // no auto reset for dev reloading (see packages/app/src/styles/index.ts)
    filterColorPallete(presetUno()),
    presetIcons({
      extraProperties: {
        display: "inline-block",
      },
    }),
    dummyPreset(),
  ],
  rules: [
    dummyRule("absolute"),
    dummyRule("fixed"),
    ...dummyPresetIconsRules(["ri"]),
  ],
  transformers: [
    transformerTypescriptDsl(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
