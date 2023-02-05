// used to generate tw-api.ts

import { dummyRule } from "@hiogawa/unocss-typescript-dsl";
import { dummyPreset } from "@hiogawa/unocss-typescript-dsl";
import type { Theme } from "@unocss/preset-uno";
import { pickBy } from "lodash";
import { Preset, defineConfig, presetUno } from "unocss";
import { antdPreset } from "./src";

export default defineConfig({
  presets: [filterColors(presetUno()), antdPreset(), dummyPreset()],
  rules: [dummyRule("ring-<num>")],
});

// strip out color palettes but keep current/transparent etc...
function filterColors(preset: Preset<Theme>): Preset<Theme> {
  if (preset.theme?.colors) {
    preset.theme.colors = pickBy(
      preset.theme.colors,
      (v) => typeof v !== "object"
    );
  }
  return preset;
}
