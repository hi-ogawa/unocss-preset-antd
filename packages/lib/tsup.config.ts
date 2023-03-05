import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/reset.ts"],
  format: ["esm", "cjs"],
  external: ["./reset.css"],
  dts: true,
  splitting: false,
});
