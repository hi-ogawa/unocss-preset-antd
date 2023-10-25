import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/react/index.ts", "src/preact/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
});
