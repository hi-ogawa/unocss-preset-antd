import { unocssPresetAntd } from "@hiogawa/unocss-preset-antd";
import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerCompileClass,
} from "unocss";

export default defineConfig({
  presets: [
    // @ts-ignore peer dep version
    unocssPresetAntd(),
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
