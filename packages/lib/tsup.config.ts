import fs from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  loader: {
    ".css": "text",
  },
  define: {
    // bundle default unocss reset to reduce runtime deps
    __DEFINE_RAW__: JSON.stringify({
      "@unocss/reset/tailwind.css": fs.readFileSync(
        "node_modules/@unocss/reset/tailwind.css",
        "utf-8"
      ),
    }),
  },
});
