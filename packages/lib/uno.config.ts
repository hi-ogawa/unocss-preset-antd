// used to generate tw-api.ts

import { dummyRule, filterColorPallete } from "@hiogawa/unocss-typescript-dsl";
import { dummyPreset } from "@hiogawa/unocss-typescript-dsl";
import { defineConfig, presetUno } from "unocss";
import { antdPreset } from "./src";

export default defineConfig({
  presets: [filterColorPallete(presetUno(), []), antdPreset(), dummyPreset()],
  rules: [
    dummyRule("ring-<num>"),
    dummyRule("opacity-<percent>"),
    dummyRule("rounded-full"),
  ],
});
