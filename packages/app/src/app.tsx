import { ThemeSelectButton } from "./components/misc";

export function App() {
  return <AppInner />;
}

function AppInner() {
  return (
    <div className="h-full w-full flex flex-col relative">
      <Header />
      <Main />
    </div>
  );
}

function Header() {
  return (
    <header className="w-full flex justify-end items-center p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <h1 className="text-xl">UnoCSS Ant Design</h1>
      <div className="flex-1"></div>
      <div className="flex gap-3 flex items-center">
        <ThemeSelectButton />
        <a
          className="flex items-center antd-btn antd-btn-ghost"
          href="https://github.com/hi-ogawa/unocss-preset-antd"
          target="_blank"
        >
          <span className="i-ri-github-line w-6 h-6"></span>
        </a>
      </div>
    </header>
  );
}

function Main() {
  return (
    <main className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border border-[var(--antd-colorBorderSecondary)] p-3">
        <h2 className="text-xl">Button</h2>
        <div className="flex flex-col gap-3">
          <button className="antd-btn antd-btn-primary">btn-primary</button>
          <button className="antd-btn antd-btn-default">btn-default</button>
          <button className="antd-btn antd-btn-ghost">btn-ghost</button>
          <button className="antd-btn antd-btn-primary" disabled>
            btn-primary (disabled)
          </button>
          <button className="antd-btn antd-btn-default" disabled>
            btn-default (disabled)
          </button>
          <button className="antd-btn antd-btn-ghost" disabled>
            btn-ghost (disabled)
          </button>
        </div>
      </section>
    </main>
  );
}
