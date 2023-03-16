import { Debug, toDelayedSetState } from "@hiogawa/utils-react";
import React from "react";
import { tw } from "../styles/tw";
import { Modal } from "./modal";
import { TopProgressBar, useProgress } from "./top-progress-bar";

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

export function StoryTypography() {
  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Typography</h2>
        <div className="flex flex-col gap-3">
          <a className="antd-link">Link Text</a>
        </div>
      </section>
    </div>
  );
}

export function StoryTab() {
  // based on https://github.com/hi-ogawa/web-ext-vite-template/pull/12

  const TABS = ["import", "export"] as const;
  const [currentTab, setCurrentTab] =
    React.useState<(typeof TABS)[number]>("import");

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Tab</h2>
        <div className="px-2 flex flex-col gap-2 h-full">
          <ul className="antd-tablist gap-5 px-2">
            {TABS.map((tab) => (
              <li
                key={tab}
                className="antd-tab py-1.5 capitalize"
                aria-selected={tab === currentTab}
                onClick={() => {
                  setCurrentTab(tab);
                }}
              >
                {tab}
              </li>
            ))}
          </ul>
          <div className="flex-1 p-2">
            {currentTab === "import" && <div>import tab content</div>}
            {currentTab === "export" && <div>export tab content</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

export function StoryTopProgressBar() {
  const [loading, setLoading] = React.useState(false);
  const [setLoadingDelayed, setLogingReset] = toDelayedSetState(setLoading);
  const progress = useProgress(loading);

  function setLoadingDuration(ms: number) {
    setLogingReset();
    setLoading(true);
    setLoadingDelayed(false, ms);
  }

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">TopProgressBar</h2>
        <div className={tw.flex.gap_3.$}>
          {[200, 500, 1000, 5000].map((ms) => (
            <button
              key={ms}
              className="antd-btn antd-btn-default px-2"
              onClick={() => {
                setLoadingDuration(ms);
              }}
            >
              {ms}ms
            </button>
          ))}
        </div>
        <TopProgressBar loading={loading} />
        <Debug debug={{ loading, progress }} />
      </section>
    </div>
  );
}

export function StoryModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Modal</h2>
        <button
          className="antd-btn antd-btn-primary px-2"
          onClick={() => setOpen(true)}
        >
          Open
        </button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col h-full p-3">
            <h3>Modal Content Title</h3>
            <div className="flex-1"></div>
            <div className="flex justify-end">
              <button
                className="antd-btn antd-btn-default px-2"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
}
