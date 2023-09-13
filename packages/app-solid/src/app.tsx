import {
  type Component,
  For,
  createComponent,
  createMemo,
  onMount,
  untrack,
} from "solid-js";
import { HistoryProvider, Link, useHistory } from "./components/router-utils";
import { ThemeSelect } from "./components/theme";
import * as stories from "./stories";

export function App() {
  // TODO: provider chain utility?
  return (
    <HistoryProvider>
      <AppInner />
    </HistoryProvider>
  );
}

//
// routes
//

// type check
stories satisfies Record<string, Component>;

const appRoutes = Object.entries(stories).map(([name, Component]) => ({
  to: "/" + name.slice(5),
  Component,
}));

function NotFound() {
  const history = useHistory();
  onMount(() => untrack(history).push(appRoutes[0].to));
  return null;
}

//
// layout
//

function AppInner() {
  const history = useHistory();

  const outlet = createMemo(() => {
    const pathname = history().location.pathname;
    const found = appRoutes.find((route) => route.to === pathname);
    return found?.Component ?? NotFound;
  });

  return (
    <div class="h-full flex flex-col">
      <AppHeader />
      <div class="flex-1 flex">
        <div class="min-w-[150px] border-r p-2">
          <AppNavMenu />
        </div>
        <div class="flex-1 m-4">
          <div class="flex justify-center">
            <div class="flex flex-col gap-4 p-4">
              {createComponent(outlet(), {})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <header class="flex items-center gap-2 p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <h1 class="text-lg">UnoCSS AntDesign SolidJS</h1>
      <span class="flex-1"></span>
      <a
        class="flex items-center antd-btn antd-btn-ghost"
        href="https://github.com/hi-ogawa/unocss-preset-antd"
        target="_blank"
      >
        <span class="i-ri-github-line w-6 h-6"></span>
      </a>
      <div class="border-l self-stretch"></div>
      <ThemeSelect />
    </header>
  );
}

function AppNavMenu() {
  return (
    <ul class="flex flex-col items-stretch gap-1.5">
      <For each={appRoutes}>
        {(item) => (
          <li class="flex">
            <Link
              class="flex-1 antd-menu-item p-2 data-[active=true]:antd-menu-item-active"
              to={item.to}
            >
              {item.to.slice(1)}
            </Link>
          </li>
        )}
      </For>
    </ul>
  );
}
