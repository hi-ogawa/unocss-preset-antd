import { objectMapValues } from "@hiogawa/utils";
import _antdTheme from "antd/lib/theme";
import _antdAlias from "antd/lib/theme/util/alias";

// fixup default export
const antdTheme = (_antdTheme as any).default as typeof _antdTheme;
const antdAlias = (_antdAlias as any).default as typeof _antdAlias;

// for now, we only use constants for "colorXXX", `boxShadowXXX", etc...
const blacklist = [
  "blue",
  "purple",
  "cyan",
  "green",
  "magenta",
  "pink",
  "red",
  "orange",
  "yellow",
  "volcano",
  "geekblue",
  "gold",
  "lime",
  "fontSize",
  "lineHeight",
  "size",
  "controlHeight",
  "padding",
  "margin",
  "screen",
];

const blacklistRe = new RegExp(`^(${blacklist.join("|")})`);

function toSlim(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, _v]) => !k.match(blacklistRe))
  );
}

async function main() {
  const { defaultSeed, defaultAlgorithm, darkAlgorithm, compactAlgorithm } =
    antdTheme;

  const algorithms = {
    default: defaultAlgorithm,
    dark: darkAlgorithm,
    compact: compactAlgorithm,
  };
  const result = objectMapValues(algorithms, (algorithm) =>
    toSlim(antdAlias({ ...algorithm(defaultSeed), override: {} }))
  );

  const output = `\
// auto-generated by build-theme.ts
// prettier-ignore
export const theme = ${JSON.stringify(result, null, 2)};
`.trim();
  console.log(output);
}

main();
