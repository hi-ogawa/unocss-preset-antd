// used to generate tw-api.ts

import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      primary: "blue",
    },
  },
  presets: [presetUno()],
});
