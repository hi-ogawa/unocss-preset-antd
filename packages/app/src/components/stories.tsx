import { createTinyForm } from "@hiogawa/tiny-form";
import { useTinyStoreStorage } from "@hiogawa/tiny-store/dist/react";
import {
  TOAST_POSITIONS,
  type ToastPosition,
} from "@hiogawa/tiny-toast/dist/react";
import { Transition } from "@hiogawa/tiny-transition/dist/react";
import { ANTD_VARS } from "@hiogawa/unocss-preset-antd";
import { none, objectKeys, objectPickBy, range } from "@hiogawa/utils";
import { Debug, toSetSetState, useDelay } from "@hiogawa/utils-react";
import React from "react";
import ReactSelect from "react-select";
import { tw } from "../styles/tw";
import { cls } from "../utils/misc";
import { getCollapseProps } from "./collapse";
import { useModal } from "./modal";
import { PopoverSimple } from "./popover";
import { SimpleSelect } from "./select";
import { toast } from "./toast/api";
import { CustomToastItemComponent, ToastContainer } from "./toast/custom";
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
  const form = createTinyForm(
    useTinyStoreStorage("unocss-preset-antd:StoryColor", {
      reactSelect: false,
      color: ANTD_VARS.colorText,
      backgroundColor: ANTD_VARS.colorBgContainer,
      borderColor: ANTD_VARS.colorBorderSecondary,
    })
  );

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">Color</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-colorTextLabel">Preview</span>
            <div
              className="border h-[50px] flex justify-center items-center"
              style={{
                color: form.data.color,
                backgroundColor: form.data.backgroundColor,
                borderColor: form.data.borderColor,
              }}
            >
              Hello World
            </div>
          </div>
          <div className="border-t my-1"></div>
          <label className="flex items-center gap-2">
            <span className="text-colorTextLabel">Use react-select</span>
            <input
              type="checkbox"
              {...form.fields.reactSelect.props({ checked: true })}
            />
          </label>
          {renderField("Text", form.fields.color)}
          {renderField("Background", form.fields.backgroundColor)}
          {renderField("Border", form.fields.borderColor)}
        </div>
      </section>
    </div>
  );

  //
  // helper
  //

  function renderField(
    label: string,
    { value, onChange }: { value: string; onChange: (v: string) => void }
  ) {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-colorTextLabel">{label}</span>
        {form.data.reactSelect ? (
          <ReactSelect
            unstyled
            options={ANTD_COLORS_OPTIONS}
            value={ANTD_COLORS_OPTIONS.find((option) => option.value === value)}
            onChange={(option) => onChange(option!.value)}
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
            value={ANTD_COLORS_OPTIONS.find((option) => option.value === value)}
            options={ANTD_COLORS_OPTIONS}
            onChange={(option) => onChange(option!.value)}
            labelFn={(v) => v?.label}
          />
        )}
      </label>
    );
  }
}

export function StoryForm() {
  const form = createTinyForm(
    React.useState({
      username: "",
      password: "",
      age: undefined as number | undefined,
      subscribe: false,
    })
  );

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="w-full max-w-lg border p-4">
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(() => {
            window.alert(
              "Submission data\n" + JSON.stringify(form.data, null, 2)
            );
          })}
        >
          <h2 className="text-xl">Register</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Username</span>
              <input
                className="antd-input p-1"
                required
                {...form.fields.username.props()}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Password</span>
              <input
                className="antd-input p-1"
                type="password"
                required
                {...form.fields.password.props()}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-colorTextLabel">Age (optional)</span>
              <input
                type="number"
                className="antd-input p-1"
                name={form.fields.age.name}
                value={String(form.fields.age.value ?? "")}
                onChange={(e) =>
                  form.fields.age.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-colorTextLabel">
                Subscribe to a news letter
              </span>
              <input
                type="checkbox"
                {...form.fields.subscribe.props({ checked: true })}
              />
            </label>
            <button className="antd-btn antd-btn-primary p-1">Submit</button>
            <div className="border-t my-1"></div>
            <label className="flex flex-col gap-1 text-colorTextSecondary">
              <span>Debug</span>
              <pre className="text-sm">
                {JSON.stringify(form.data, null, 2)}
              </pre>
            </label>
          </div>
        </form>
      </section>
    </div>
  );
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

export function StoryFakeProgress() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-3">
        <h2 className="text-xl">FakeProgress</h2>
        <button
          className="antd-btn antd-btn-primary p-1"
          onClick={() => {
            setLoading((prev) => !prev);
          }}
        >
          {loading ? "Finish" : "Start"}
        </button>
        <div className="fixed top-0 left-0 right-0 h-1 pointer-events-none">
          {/* cf. https://github.com/badrap/bar-of-progress/blob/master/src/index.ts */}
          <Transition
            show={loading}
            className="absolute inset-0 bg-colorPrimary"
            style={{
              transformOrigin: "0 0",
            }}
            onEnterFrom={(el) => {
              el.style.transition =
                "transform 10s cubic-bezier(0.05, 0.5, 0, 1)";
            }}
            enterFrom="scale-x-0"
            enterTo="scale-x-95"
            onLeaveFrom={(el) => {
              el.style.transition = [
                "transform 0.1s linear",
                "filter 0.3s ease-in-out",
                "opacity 0.5s ease-in-out 0.3s",
              ].join(",");
            }}
            leaveFrom="opacity-1 brightness-100"
            leaveTo="scale-x-100 opacity-0 brightness-150"
          />
        </div>
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

export function StoryToast() {
  const form = createTinyForm(
    useTinyStoreStorage("unocss-preset-antd:StoryToast-v2", {
      animationType: "default",
      duration: 4000,
      position: "top-center" as ToastPosition,
    })
  );
  const { duration, position } = form.data;

  React.useSyncExternalStore(
    toast.subscribe,
    toast.getSnapshot,
    toast.getSnapshot
  );

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-4 w-full max-w-2xl border p-3">
        <h2 className="text-xl">Toast</h2>
        <div className="flex flex-col gap-1">
          Animation Type
          <SimpleSelect
            className="antd-input p-1"
            options={["default", "custom", "none"]}
            {...form.fields.animationType.rawProps()}
          />
        </div>
        <div className="flex flex-col gap-1">
          Duration
          <SimpleSelect
            className="antd-input p-1"
            options={[2000, 4000, 8000]}
            labelFn={(v) => `${v / 1000}s`}
            {...form.fields.duration.rawProps()}
          />
        </div>
        <div className="flex flex-col gap-1">
          Duration
          <SimpleSelect
            className="antd-input p-1"
            options={TOAST_POSITIONS}
            {...form.fields.position.rawProps()}
          />
        </div>
        <div className="flex flex-col gap-1">
          Toast Status
          <div className="flex gap-2">
            <button
              className="flex-1 antd-btn antd-btn-default px-2"
              onClick={() => {
                toast.success("Successfuly toasted!", {
                  position,
                  duration,
                });
              }}
            >
              Success
            </button>
            <button
              className="flex-1 antd-btn antd-btn-default px-2"
              onClick={() => {
                toast.error("This didn't work.", {
                  position,
                  duration,
                });
              }}
            >
              Error
            </button>
            <button
              className="flex-1 antd-btn antd-btn-default px-2"
              onClick={() => {
                toast.info("Some info", {
                  position,
                  duration,
                });
              }}
            >
              Info
            </button>
            <button
              className="flex-1 antd-btn antd-btn-default px-2"
              onClick={() => {
                toast.blank("Just message", {
                  position,
                  duration,
                });
              }}
            >
              Blank
            </button>
            <button
              className="flex-1 antd-btn antd-btn-default px-2"
              onClick={() => {
                toast.custom(
                  (props) => <CustomToastItemComponent {...props} />,
                  {
                    position,
                    duration,
                  }
                );
              }}
            >
              Custom
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          Extra actions
          <div className="flex gap-2">
            <button
              className="antd-btn antd-btn-default px-4"
              onClick={() => {
                toast.dismissAll();
              }}
            >
              Dismiss all
            </button>
            <button
              className="antd-btn antd-btn-default px-4"
              onClick={() => {
                toast.removeAll();
              }}
            >
              Remove all
            </button>
            <button
              className="antd-btn antd-btn-default px-4 w-[100px]"
              onClick={() => {
                toast.pause(!toast.paused);
              }}
            >
              {toast.paused ? "Unpause" : "Pause"}
            </button>
          </div>
        </div>
        <div className="border h-[500px] flex flex-col relative overflow-hidden">
          <ToastContainer
            toast={toast}
            animationType={form.data.animationType}
          />
        </div>
        <Debug
          className="text-xs"
          debug={{
            paused: toast.paused,
            items: toast.items,
          }}
        />
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

// cf.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#b%C3%A9zier_curves
// https://drafts.csswg.org/css-easing-2/#cubic-bezier-easing-functions
// https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function
export function StoryCubicBezier() {
  const PRESETS = {
    ease: [0.25, 0.1, 0.25, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
  };
  type Preset = keyof typeof PRESETS;

  const form = createTinyForm(
    React.useState({
      input: "0.25, 0.1, 0.25, 1",
      preset: none<Preset>(),
      duration: "3s",
      play: false,
    })
  );

  const numbers = form.data.input.split(",").map((v) => Number.parseFloat(v));
  const [x1, _y1, x2, _y2] = numbers;
  const isValid =
    numbers.length === 4 &&
    numbers.every((n) => Number.isFinite(n)) &&
    0 <= x1 &&
    x1 <= 1 &&
    0 <= x2 &&
    x2 <= 1;

  return (
    <div className="flex flex-col items-center gap-3 m-2">
      <section className="flex flex-col gap-3 w-full max-w-lg border p-4">
        <h2 className="text-xl">Cubic Bézier</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <div className="flex items-center">
              <span className="text-colorTextSecondary flex-1">
                x1, y1, x2, y2
              </span>
              <SimpleSelect
                className="antd-input px-1 text-sm"
                value={form.fields.preset.value}
                options={[undefined, ...objectKeys(PRESETS)]}
                labelFn={(v) => v ?? "- Preset -"}
                onChange={(v) => {
                  if (v) {
                    form.fields.input.onChange(PRESETS[v].join(", "));
                  }
                  form.fields.preset.onChange(v);
                }}
              />
            </div>
            <input
              className="antd-input p-1"
              aria-invalid={!isValid}
              {...form.fields.input.props()}
            />
          </label>
          <div className="self-center w-full">
            <svg
              // flip y for conventional axis direction
              style={{ transform: "matrix(1, 0, 0, -1, 0, 0)" }}
              viewBox="-5 -5 110 110"
              stroke="currentColor"
              fill="transparent"
            >
              <rect x="0" y="0" width="100" height="100" opacity={0.2} />
              {isValid && renderSvg({ numbers })}
            </svg>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-colorTextSecondary">Duration</span>
            <input
              className="antd-input p-1"
              {...form.fields.duration.props()}
            />
          </label>
          <button
            className="antd-btn antd-btn-primary p-1"
            disabled={!isValid}
            onClick={() => {
              form.fields.play.onChange((prev) => !prev);
            }}
          >
            Play
          </button>
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-1">
              <span className="text-colorTextSecondary">linear</span>
              <div className="h-1 w-full relative bg-colorBorder">
                {form.data.play && (
                  <Transition
                    show
                    appear
                    className="absolute inset-0 bg-colorSuccess"
                    style={{
                      transformOrigin: "0 0",
                      transition: `transform ${form.data.duration} linear`,
                    }}
                    enterFrom="scale-x-0"
                    enterTo="scale-x-100"
                  />
                )}
              </div>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-colorTextSecondary">cubic-bezier</span>
              <div className="h-1 w-full relative bg-colorBorder">
                {form.data.play && (
                  <Transition
                    show
                    appear
                    className="absolute inset-0 bg-colorSuccess"
                    style={{
                      transformOrigin: "0 0",
                      transition: `transform ${form.data.duration} cubic-bezier(${form.data.input})`,
                    }}
                    enterFrom="scale-x-0"
                    enterTo="scale-x-100"
                  />
                )}
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>
  );

  function renderSvg({ numbers }: { numbers: number[] }) {
    const [x1, y1, x2, y2] = numbers.map((n) => n * 100);
    return (
      <>
        <path d={`M 0 0 C ${x1} ${y1}, ${x2} ${y2}, 100 100`} />
        <g className="text-colorPrimary" fill="currentColor">
          <path d={`M 0 0 L ${x1} ${y1}`} />
          <path d={`M ${x2} ${y2} L 100 100`} />
          {/* TODO: interactive circle? */}
          <circle cx="0" cy="0" r="1" />
          <circle cx={x1} cy={y1} r="1" />
          <circle cx={x2} cy={y2} r="1" />
          <circle cx="100" cy="100" r="1" />
        </g>
      </>
    );
  }
}
