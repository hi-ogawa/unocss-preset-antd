export function StoryButton() {
  return (
    <main className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Button</h2>
        {/* prettier-ignore */}
        <div className="flex flex-col gap-3">
          <button className="antd-btn antd-btn-primary">btn-primary</button>
          <button className="antd-btn antd-btn-default">btn-default</button>
          <button className="antd-btn antd-btn-ghost">btn-ghost</button>
          <button className="antd-btn antd-btn-text">btn-text</button>
        </div>
        <div className="border-t mx-2"></div>
        <h2 className="text-lg">Disabled</h2>
        {/* prettier-ignore */}
        <div className="flex flex-col gap-3">
          <button className="antd-btn antd-btn-primary" disabled>btn-primary (disabled)</button>
          <button className="antd-btn antd-btn-default" disabled>btn-default (disabled)</button>
          <button className="antd-btn antd-btn-ghost" disabled>btn-ghost (disabled)</button>
          <button className="antd-btn antd-btn-text" disabled>btn-text (disabled)</button>
        </div>
        <div className="border-t mx-2"></div>
        <h2 className="text-lg">Loading</h2>
        {/* prettier-ignore */}
        <div className="flex flex-col gap-3">
          <button className="antd-btn antd-btn-primary relative flex justify-center items-center" disabled>
            btn-primary + spin
            <span className="antd-spin w-4 h-4 absolute right-2"></span>
          </button>
        </div>
      </section>
    </main>
  );
}

export function StoryInput() {
  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Input</h2>
        {/* prettier-ignore */}
        <div className="flex flex-col gap-3">
          <input className="px-2 antd-input" placeholder="input" />
          <input className="px-2 antd-input" placeholder="input (disabled)" disabled />
          <input className="px-2 antd-input" placeholder="input (aria-invalid)" aria-invalid />
        </div>
      </section>
    </div>
  );
}
