import { execSync } from "node:child_process";
import fs from "node:fs";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    unocss(),
    react(),
    unocssDepHmrPlugin([require.resolve("@hiogawa/unocss-preset-antd")]),
    injectHtmlPlugin(),
  ],
});

//
// poor man's unocss dep HMR (cf. https://github.com/unocss/unocss/blob/bb321caea95dd0a6e0cc44c22d897a9dc96cb6c9/packages/vite/src/config-hmr.ts)
//
function unocssDepHmrPlugin(deps: string[]): Plugin {
  const name = "local:" + unocssDepHmrPlugin.name;
  return {
    name,
    async configureServer(server) {
      server.watcher.add(deps);
      server.watcher.on("change", async (changedPath) => {
        if (deps.includes(changedPath)) {
          // clear require.cache and touch uno.config.ts to invoke unocss's own HMR
          server.config.logger.info(`(${name}) reloading uno.config.ts ...`, {
            timestamp: true,
          });
          delete require.cache[changedPath];
          execSync("touch uno.config.ts");
        }
      });
    },
  };
}

//
// inject theme initialization script
//
function injectHtmlPlugin() {
  const script = fs.readFileSync(
    require.resolve("@hiogawa/utils-experimental/dist/theme-script.global.js"),
    "utf-8"
  );
  return {
    name: "local:" + injectHtmlPlugin.name,
    transformIndexHtml(html: string) {
      return html.replace(
        /<!--@@INJECT_THEME_SCRIPT@@-->/,
        `\
<script>
  globalThis.__themeStorageKey = "unocss-preset-antd-app:theme";
  ${script}
</script>`
      );
    },
  };
}
