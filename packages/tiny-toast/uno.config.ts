import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerCompileClass,
} from "unocss";

export default defineConfig({
  // need to transform dist js files which is excluded by default
  include: [/.*\.js/, /.*\.cjs/],
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
