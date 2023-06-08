import unocss from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { injectHtmlPlugin, unocssDepHmrPlugin } from "../app/vite.config";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    unocss(),
    solid(),
    unocssDepHmrPlugin([require.resolve("@hiogawa/unocss-preset-antd")]),
    injectHtmlPlugin(),
  ],
});
