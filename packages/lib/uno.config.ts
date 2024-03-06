import { filterColorPallete, presetFixAutocomplete } from "@hiogawa/unocss-ts";
import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { unocssPresetAntd } from "./src";

export default defineConfig({
  presets: [
    filterColorPallete(presetUno()),
    unocssPresetAntd(),
    presetFixAutocomplete(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
