import fs from "node:fs";

// usage:
//   node misc/inject-css.mjs

const MARKER = "/*__INJECT_CSS__*/";

const TARGET_FILES = ["./dist/react/index.js", "./dist/react/index.cjs"];

const CSS_FILE = "dist/react.css";

function main() {
  const css = fs.readFileSync(CSS_FILE, "utf-8");
  for (const file of TARGET_FILES) {
    const content = fs.readFileSync(file, "utf-8");
    fs.writeFileSync(file, content.replace(MARKER, css));
  }
}

main();
