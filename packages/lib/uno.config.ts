// used to generate tw-api.ts

import {
  dummyPreset,
  dummyRule,
  dummyVariant,
  filterColorPallete,
} from "@hiogawa/unocss-typescript-dsl";
import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { unocssPresetAntd } from "./src";

export default defineConfig({
  presets: [filterColorPallete(presetUno()), unocssPresetAntd(), dummyPreset()],
  rules: [
    dummyRule("ring-<num>"),
    dummyRule("opacity-<percent>"),
    dummyRule("rounded-full"),
  ],
  variants: [dummyVariant("media-$media")],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
