import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/react.tsx",
    "src/preact/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
});
