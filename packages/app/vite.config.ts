import { execSync } from "node:child_process";
import { themeScriptPlugin } from "@hiogawa/theme-script/dist/vite";
import { vitePluginTinyRefresh } from "@hiogawa/tiny-refresh/dist/vite";
import unocss from "unocss/vite";
import { type Plugin, defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    unocss(),
    unocssDepHmrPlugin([require.resolve("@hiogawa/unocss-preset-antd")]),
    vitePluginTinyRefresh(),
    themeScriptPlugin({
      storageKey: "unocss-preset-antd-app:theme",
    }),
  ],
});

//
// poor man's unocss dep HMR (cf. https://github.com/unocss/unocss/blob/bb321caea95dd0a6e0cc44c22d897a9dc96cb6c9/packages/vite/src/config-hmr.ts)
//
export function unocssDepHmrPlugin(deps: string[]): Plugin {
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
