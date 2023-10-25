import unocss from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./.vercel/dist",
  },
  plugins: [unocss()],
});
