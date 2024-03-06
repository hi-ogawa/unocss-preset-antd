import { unocssPresetAntd } from "@hiogawa/unocss-preset-antd";
import {
  filterColorPallete,
  presetFixAutocomplete,
  transformerTypescriptDsl,
} from "@hiogawa/unocss-ts";
import riIcon from "@iconify-json/ri/icons.json";
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
    presetFixAutocomplete({ icons: [riIcon] }),
  ],
  transformers: [
    transformerTypescriptDsl(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
