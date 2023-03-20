// used to generate tw-api.ts

import { dummyRule, filterColorPallete } from "@hiogawa/unocss-typescript-dsl";
import { dummyPreset } from "@hiogawa/unocss-typescript-dsl";
import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { antdPreset } from "./src";

export default defineConfig({
  presets: [
    filterColorPallete(presetUno()),
    antdPreset({ reset: false }),
    dummyPreset(),
  ],
  rules: [
    dummyRule("ring-<num>"),
    dummyRule("opacity-<percent>"),
    dummyRule("rounded-full"),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
