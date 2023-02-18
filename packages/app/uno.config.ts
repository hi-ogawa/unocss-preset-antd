import { antdPreset } from "@hiogawa/unocss-preset-antd";
import {
  dummyPresetIconsRules,
  transformerTypescriptDsl,
} from "@hiogawa/unocss-typescript-dsl";
import { dummyPreset } from "@hiogawa/unocss-typescript-dsl";
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
    antdPreset(),
    presetUno(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
      },
    }),
    dummyPreset(),
  ],
  rules: [...dummyPresetIconsRules(["ri"])],
  transformers: [
    transformerTypescriptDsl(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
