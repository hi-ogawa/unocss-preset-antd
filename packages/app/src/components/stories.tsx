import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { ANTD_VARS } from "@hiogawa/unocss-preset-antd";
import { objectPickBy, range } from "@hiogawa/utils";
import { Debug, toSetSetState, useDelay } from "@hiogawa/utils-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { getCollapseProps } from "./collapse";
import { useModal } from "./modal";
import { PopoverSimple } from "./popover";
import { SimpleSelect } from "./select";
import { SnackbarConainer } from "./snackbar";
import { useSnackbar } from "./snackbar-hook";
import { TopProgressBar, useProgress } from "./top-progress-bar";

export function StoryButton() {
  const [fab, setFabInner] = React.useState(new Set([0, 1]));
  const setFab = toSetSetState(setFabInner);

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
            <span className="antd-spin w-4 absolute right-2"></span>
          </button>
          <button className="antd-btn antd-btn-primary antd-btn-loading" disabled>
            btn-primary + btn-loading
          </button>
        </div>
        <div className="border-t mx-2"></div>
        <h2 className="text-lg flex items-baseline gap-1.5">
          Fab
          <span className="text-sm text-colorTextSecondary">
            (Floating action button)
          </span>
        </h2>
        <div className="flex w-28">
          <Transition
            appear
            show={fab.has(0)}
            className="transition duration-500"
            enterFrom="scale-30 opacity-0"
            enterTo="scale-100 opacity-100"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-30 opacity-0"
          >
            <button
              className="antd-btn !antd-btn-primary antd-floating w-12 h-12 rounded-full flex justify-center items-center"
              onClick={() => setFab.toggle(1)}
            >
              <span className="i-ri-check-line w-6 h-6" />
            </button>
          </Transition>
          <div className="flex-1"></div>
          <Transition
            // appear
            show={fab.has(1)}
            className="transition duration-500"
            enterFrom="scale-30 opacity-0"
            enterTo="scale-100 opacity-100"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-30 opacity-0"
          >
            <button
              className="antd-btn antd-btn-text antd-floating w-12 h-12 rounded-full flex justify-center items-center"
              onClick={() => setFab.toggle(0)}
            >
              <span className="i-ri-close-line w-6 h-6" />
            </button>
          </Transition>
        </div>
        <pre>fab = {JSON.stringify([...fab])}</pre>
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

const ANTD_COLORS = objectPickBy(ANTD_VARS, (_, k) => k.startsWith("color"));
const ANTD_COLORS_OPTIONS = Object.entries(ANTD_COLORS).map(
  ([label, value]) => ({ label, value })
);

export function StoryColor() {
  const form = useForm({
    defaultValues: {
      useReactSelect: true,
      color: ANTD_VARS.colorText,
      backgroundColor: ANTD_VARS.colorBgContainer,
      borderColor: ANTD_VARS.colorBorderSecondary,
    },
  });
  const { useReactSelect } = form.watch();

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Color</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-colorTextLabel">Preview</span>
            <div
              className="border h-[50px] flex justify-center items-center"
              style={form.watch()}
            >
              Hello World
            </div>
          </div>
          <div className="border-t my-1"></div>
          <label className="flex items-center gap-2">
            <span className="text-colorTextLabel">Use react-select</span>
            <input type="checkbox" {...form.register("useReactSelect")} />
          </label>
          {renderField("color", "Text")}
          {renderField("backgroundColor", "Background")}
          {renderField("borderColor", "Border")}
        </div>
      </section>
    </div>
  );

  //
  // helper
  //

  function renderField(
    name: Parameters<typeof form.register>[0],
    label: string
  ) {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-colorTextLabel">{label}</span>
        <Controller
          control={form.control}
          name={name}
          render={({ field }) =>
            // TODO: preview by hover?
            useReactSelect ? (
              <ReactSelect
                unstyled
                options={ANTD_COLORS_OPTIONS}
                value={ANTD_COLORS_OPTIONS.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                classNames={{
                  control: () => "antd-input px-2",
                  placeholder: () => "text-colorTextSecondary",
                  menu: () => "border antd-floating mt-2",
                  menuList: () => "flex flex-col gap-1 py-1",
                  option: (state) =>
                    cls(
                      "antd-menu-item cursor-pointer p-1 px-2 text-sm",
                      state.isSelected && "antd-menu-item-active"
                    ),
                }}
              />
            ) : (
              <SimpleSelect
                className="antd-input p-2"
                value={ANTD_COLORS_OPTIONS.find(
                  (option) => option.value === field.value
                )}
                options={ANTD_COLORS_OPTIONS}
                onChange={(option) => field.onChange(option?.value)}
                labelFn={(v) => v?.label}
              />
            )
          }
        />
      </label>
    );
  }
}

export function StoryTypography() {
  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Typography</h2>
        {/* prettier-ignore */}
        <div className="flex flex-col gap-3">
          <span>default</span>
          <span className="text-colorTextSecondary">text-colorTextSecondary</span>
          <span className="text-colorPrimary">text-colorPrimary</span>
          <span className="text-colorErrorText">text-colorErrorText</span>
          <a className="antd-link">antd-link</a>
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
  const progress = useProgress(loading);

  const options = [200, 500, 1000, 5000];
  const delayed = new Map(
    options.map((ms) => [ms, useDelay(() => setLoading(false), ms)] as const)
  );

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">TopProgressBar</h2>
        <div className={tw.flex.gap_3.$}>
          {options.map((ms) => (
            <button
              key={ms}
              className="antd-btn antd-btn-default px-2"
              onClick={() => {
                setLoading(true);
                delayed.get(ms)!();
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
  const modal = useModal();

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Modal</h2>
        <button
          className="antd-btn antd-btn-primary px-2"
          onClick={() => modal.setOpen(true)}
        >
          Open
        </button>
        <modal.Wrapper className="!max-w-[400px] !max-h-[300px]">
          <div className="flex flex-col h-full p-3 gap-2">
            <h3 className="text-lg">Modal Content Title</h3>
            <div className="flex-1">Hello</div>
            <div className="flex justify-end">
              <button
                className="antd-btn antd-btn-default px-2"
                onClick={() => modal.setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </modal.Wrapper>
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
            className="duration-500 overflow-hidden"
            {...getCollapseProps()}
          >
            <div className="pt-3">Collapsable Div</div>
          </Transition>
        </div>
      </section>
    </div>
  );
}

export function StorySnackbar() {
  const snackbar = useSnackbar();

  const form = useForm({
    defaultValues: {
      animationType: "2",
      durationClassName: "duration-4000",
    },
  });

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-4 w-full max-w-2xl border p-3">
        <h2 className="text-xl">Snackbar</h2>
        <div className="flex flex-col gap-1">
          Animation Type
          <select
            className="antd-input p-1"
            {...form.register("animationType")}
          >
            {[1, 2].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          Duration
          <select
            className="antd-input p-1"
            {...form.register("durationClassName")}
          >
            {["duration-2000", "duration-4000", "duration-8000"].map((v) => (
              <option key={v} value={v}>
                {Number(v.split("-")[1]) / 1000}s
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          Toast Type
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
        </div>
        <div className="border h-[500px] p-3 flex flex-col relative overflow-hidden">
          <SnackbarConainer
            animationType={form.watch("animationType")}
            durationClassName={form.watch("durationClassName")}
          />
        </div>
        <Debug debug={snackbar.items} />
      </section>
    </div>
  );
}

export function StoryPopover() {
  const placements = {
    1: "top-start",
    2: "top",
    3: "top-end",
    5: "left-start",
    10: "left",
    15: "left-end",
    9: "right-start",
    14: "right",
    19: "right-end",
    21: "bottom-start",
    22: "bottom",
    23: "bottom-end",
  } as const;

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-2xl border p-3">
        <h2 className="text-xl">Popover</h2>
        <div className="flex justify-center gap-2">
          <div className="grid grid-cols-5 p-2 gap-2 w-sm">
            {range(25).map((i) => {
              const placement = placements[i as 1];
              if (placement) {
                return (
                  <PopoverSimple
                    key={i}
                    placement={placement}
                    reference={(context) => (
                      <button
                        className={cls(
                          "antd-btn antd-btn-default py-1 px-2",
                          context.open &&
                            tw.text_colorPrimaryActive.border_colorPrimaryActive
                              .$
                        )}
                      >
                        {placement.replace("-", "\n")}
                      </button>
                    )}
                    floating={(context) => (
                      <div className="flex flex-col gap-2 px-3 py-2 w-[150px] text-sm">
                        <div>Content</div>
                        <button
                          className={tw.antd_btn.antd_btn_default.$}
                          onClick={() => context.onOpenChange(false)}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  />
                );
              }
              return <span key={i} />;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
