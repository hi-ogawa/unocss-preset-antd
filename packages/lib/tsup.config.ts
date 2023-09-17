import fs from "node:fs";
import { createRequire } from "node:module";
import { defineConfig } from "tsup";

const require = createRequire(import.meta.url);

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
        require.resolve("@unocss/reset/tailwind.css"),
        "utf-8"
      ),
    }),
  },
});
