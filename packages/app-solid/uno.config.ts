import { unocssPresetAntd } from "@hiogawa/unocss-preset-antd";
import {
  dummyPreset,
  dummyPresetIconsRules,
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
    unocssPresetAntd(),
    filterColorPallete(presetUno()),
    presetIcons({
      extraProperties: {
        display: "inline-block",
      },
    }),
    dummyPreset(),
  ],
  rules: [...dummyPresetIconsRules(["ri"])],
  transformers: [
    // @ts-ignore
    transformerTypescriptDsl(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
