import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerCompileClass,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
      },
    }),
  ],
  transformers: [
    transformerCompileClass({
      trigger: "=",
      classPrefix: "uno-tiny-toast-",
    }),
  ],
});
