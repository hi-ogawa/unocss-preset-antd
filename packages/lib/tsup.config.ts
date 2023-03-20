import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/reset-dev.ts", "src/reset-dev.css"],
  external: ["./reset-dev.css"],
  format: ["esm", "cjs"],
  dts: {
    entry: ["src/index.ts", "src/reset-dev.ts"],
  },
  splitting: false,
});
