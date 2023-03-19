import path from "node:path";
import unocss from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
    outDir: "dist/vite",
  },
  plugins: [unocss()],
});
