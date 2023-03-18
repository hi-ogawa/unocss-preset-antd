import { Transition } from "@headlessui/react";
import { tinyassert } from "@hiogawa/utils";
import { Debug, toDelayedSetState } from "@hiogawa/utils-react";
import React from "react";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { Modal } from "./modal";
import { SnackbarItemOptions, useSnackbar } from "./snackbar-hook";
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
        <Modal
          className="!max-w-[400px] !max-h-[300px]"
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="flex flex-col h-full p-3 gap-2">
            <h3 className="text-lg">Modal Content Title</h3>
            <div className="flex-1">Hello</div>
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

export function StorySlide() {
  const [show, setShow] = React.useState(true);

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Slide</h2>
        <button
          className="antd-btn antd-btn-default px-2"
          onClick={() => setShow(!show)}
        >
          {show ? "Hide" : "Show"}
        </button>
        <div className="border h-[100px] overflow-hidden relative">
          <Transition
            appear
            show={show}
            className="absolute top-2 right-2 inline-block duration-500 transform"
            enterFrom="translate-y-[-200%]"
            enterTo="translate-y-0"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-[-200%]"
          >
            <span className="border px-2 py-1">hello from top/right</span>
          </Transition>
          <Transition
            appear
            show={show}
            className="absolute bottom-2 left-2 inline-block duration-500 transform"
            enterFrom="translate-x-[-200%]"
            enterTo="translate-x-0"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-200%]"
          >
            <span className="border px-2 py-1">hello from bottom/left</span>
          </Transition>
        </div>
      </section>
    </div>
  );
}

export function StoryCollapse() {
  const [show, setShow] = React.useState(true);
  const collapseProps = useCollapseProps();

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Collapse</h2>
        <button
          className="antd-btn antd-btn-default px-2"
          onClick={() => setShow(!show)}
        >
          {show ? "Uncollapse" : "Collapse"}
        </button>
        <div className="flex flex-col p-3 border">
          <div>Fixed Div</div>
          <Transition
            appear
            show={show}
            className="h-0 duration-500 overflow-hidden"
            {...collapseProps}
          >
            <div className="pt-3">Collapsable Div</div>
          </Transition>
        </div>
      </section>
    </div>
  );
}

function CollapseTransition(props: Parameters<typeof Transition>[0] & object) {
  const collpaseProps = useCollapseProps();
  return <Transition {...props} {...collpaseProps} />;
}

function useCollapseProps(): Partial<Parameters<typeof Transition>[0]> {
  const refEl = React.useRef<HTMLDivElement>();

  const refCallback: React.RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      uncollapse(el);
    }
    refEl.current = el ?? undefined;
  };

  function uncollapse(el: HTMLDivElement) {
    const child = el.firstElementChild;
    tinyassert(child);
    el.style.height = child.clientHeight + "px";
  }

  function collapse(el: HTMLDivElement) {
    el.style.height = "0px";
  }

  function beforeEnter() {
    const el = refEl.current;
    tinyassert(el);
    uncollapse(el);
  }

  function beforeLeave() {
    const el = refEl.current;
    tinyassert(el);
    collapse(el);
  }

  return { ref: refCallback, beforeEnter, beforeLeave };
}

//
// snackbar/notification
//

export function StorySnackbar() {
  const snackbar = useSnackbar();

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-2xl border p-3">
        <h2 className="text-xl">Snackbar</h2>
        <div className="flex gap-2">
          <button
            className="flex-1 antd-btn antd-btn-default px-2"
            onClick={() => {
              snackbar.create("Successfuly toasted!", { type: "success" });
            }}
          >
            Success
          </button>
          <button
            className="flex-1 antd-btn antd-btn-default px-2"
            onClick={() => {
              snackbar.create("This didn't work.", { type: "error" });
            }}
          >
            Error
          </button>
          <button
            className="flex-1 antd-btn antd-btn-default px-2"
            onClick={() => {
              snackbar.create("Some neutral message");
            }}
          >
            Default
          </button>
        </div>
        <div className="border h-[200px] p-3 flex flex-col relative overflow-hidden">
          <SnackbarConainer />
        </div>
        <Debug debug={snackbar.items} />
      </section>
    </div>
  );
}

function SnackbarConainer() {
  const { items, dismiss, __update, remove } = useSnackbar();

  return (
    <div className="flex flex-col absolute bottom-1 left-2">
      {[...items].reverse().map((item) => (
        //
        // collpase transition
        //
        <CollapseTransition
          key={item.id}
          show={item.state === "show" || item.state === "dismiss-slide"}
          className="duration-300"
          afterLeave={() => remove(item.id)}
        >
          {/*  */}
          {/* slide transtion */}
          {/*  */}
          <Transition
            appear
            show={item.state === "show"}
            className="inline-block duration-500 transform py-1"
            enterFrom="translate-x-[-120%]"
            enterTo="translate-x-0"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-120%]"
            afterLeave={() => __update(item.id, { state: "dismiss-collapse" })}
          >
            <SnackbarItem
              type={item.options?.type}
              onClose={() => dismiss(item.id)}
            >
              {item.node}
            </SnackbarItem>
          </Transition>
          {/*  */}
          {/* dummy transition to auto trigger slide-out after timeout */}
          {/*  */}
          <Transition
            appear
            show={item.state === "show"}
            className="duration-2000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            afterEnter={() => dismiss(item.id)}
          />
        </CollapseTransition>
      ))}
    </div>
  );
}

function SnackbarItem(
  props: SnackbarItemOptions & {
    onClose: () => void;
    children: React.ReactNode;
  }
) {
  return (
    <div className="bg-colorBgElevated shadow-[var(--antd-boxShadowSecondary)] w-[350px]">
      <div className="flex items-center gap-3 p-3">
        <span
          className={cls(
            props.type === "success" &&
              tw.i_ri_checkbox_circle_fill.text_colorSuccess.text_2xl.$,
            props.type === "error" &&
              tw.i_ri_error_warning_fill.text_colorError.text_2xl.$
          )}
        />
        <div className="flex-1">{props.children}</div>
        <button
          className={
            tw.antd_btn.antd_btn_ghost.i_ri_close_line.text_colorTextSecondary
              .text_lg.$
          }
          onClick={props.onClose}
        />
      </div>
    </div>
  );
}
