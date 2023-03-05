import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/reset.ts", "src/reset.css"],
  format: ["esm", "cjs"],
  external: ["./reset.css"],
  dts: {
    entry: ["src/index.ts", "src/reset.ts"],
  },
  splitting: false,
});
