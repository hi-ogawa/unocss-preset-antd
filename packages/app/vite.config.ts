import { execSync } from "node:child_process";
import { themeScriptPlugin } from "@hiogawa/theme-script/dist/vite";
import { vitePluginTinyRefresh } from "@hiogawa/tiny-refresh/dist/vite";
import unocss from "unocss/vite";
import { type Plugin, WebSocketClient, defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    unocss(),
    unocssDepHmrPlugin([require.resolve("@hiogawa/unocss-preset-antd")]),
    vitePluginTinyRefresh(),
    runtimeErrorOverlayPlugin(),
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

// based on the idea in
// https://github.com/vitejs/vite/pull/6274#issuecomment-1087749460
// https://github.com/vitejs/vite/issues/2076
export function runtimeErrorOverlayPlugin(): Plugin {
  return {
    name: "local:" + runtimeErrorOverlayPlugin.name,

    apply(_config, env) {
      return env.command === "serve" && !env.ssrBuild;
    },

    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: RUNTIME_ERROR_OVERLAY_CLIENT_SCRIPT,
        },
      ];
    },

    configureServer(server) {
      server.ws.on(
        RUNTIME_ERROR_OVERLAY_MESSAGE_TYPE,
        (data: unknown, client: WebSocketClient) => {
          // deserialize error
          const error = Object.assign(new Error(), data);

          // https://vitejs.dev/guide/api-plugin.html#client-server-communication
          // https://github.com/vitejs/vite/blob/5b58eca05939c0667cf9698e83f4f4849f3296f4/packages/vite/src/node/server/middlewares/error.ts#L54-L57
          client.send({
            type: "error",
            err: {
              message: error.message,
              stack: error.stack ?? "",
            },
          });
        }
      );
    },
  };
}

const RUNTIME_ERROR_OVERLAY_MESSAGE_TYPE = "custom:runtime-error";

const RUNTIME_ERROR_OVERLAY_CLIENT_SCRIPT = /* js */ `
import { createHotContext } from "/@vite/client";

// dummy file name to instantiate import.meta.hot
const hot = createHotContext("/__runtimeErrorOverlayPlugin__.js");

function sendError(error) {
  if (!(error instanceof Error)) {
    error = new Error("(unknown runtime error)");
  }
  const serialized = {
    message: error.message,
    stack: error.stack,
  };
  hot.send("${RUNTIME_ERROR_OVERLAY_MESSAGE_TYPE}", serialized);
}

window.addEventListener("error", (evt) => {
  sendError(evt.error);
});

window.addEventListener("unhandledrejection", (evt) => {
  sendError(evt.reason);
});
`;
