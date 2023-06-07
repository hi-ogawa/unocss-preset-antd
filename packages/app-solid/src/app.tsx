import type { Placement } from "@floating-ui/dom";
import { range } from "@hiogawa/utils";
import { Index, createSignal } from "solid-js";
import { Modal } from "./components/modal";
import { Popover } from "./components/popover";
import { ThemeSelect } from "./components/theme";
import { Transition } from "./components/transition";
import { cls } from "./components/utils";

export function App() {
  return (
    <div class="flex flex-col">
      <AppHeader />
      <div class="flex justify-center">
        <div class="flex flex-col gap-4 p-4">
          <TestForm />
          <TestTransition />
          <TestModal />
          <TestPopover />
        </div>
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <header class="flex items-center gap-2 p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <h1 class="text-lg">Examples</h1>
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

function TestForm() {
  return (
    <div class="flex flex-col gap-3 p-2 border w-sm">
      <h1 class="text-xl">Form</h1>
      <label class="flex flex-col gap-1">
        <span class="text-sm text-colorTextLabel">Username</span>
        <input class="antd-input p-1" />
      </label>
      <button class="antd-btn antd-btn-primary p-1">Submit</button>
    </div>
  );
}

function TestTransition() {
  const [show, setShow] = createSignal(false);

  return (
    <div class="flex flex-col gap-3 p-2 border w-sm">
      <h1 class="text-xl">Transition</h1>
      <button
        class="antd-btn antd-btn-primary p-1"
        onClick={() => setShow(!show())}
      >
        Toggle ({show() ? "on" : "off"})
      </button>
      <div class="h-[80px] flex items-center justify-center relative">
        <div class="text-lg">Hello</div>
        <Transition
          show={show()}
          class="absolute inset-0 antd-body flex items-center justify-center duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-80"
          leaveFrom="opacity-80"
          leaveTo="opacity-0"
        >
          <div class="antd-spin w-8 h-8"></div>
        </Transition>
      </div>
    </div>
  );
}

function TestModal() {
  const [show, setShow] = createSignal(false);

  return (
    <div class="flex flex-col gap-3 p-2 border w-sm">
      <h1 class="text-xl">Modal</h1>
      <button
        class="antd-btn antd-btn-primary p-1"
        onClick={() => setShow(!show())}
      >
        Toggle ({show() ? "on" : "off"})
      </button>
      <Modal open={show()} setOpen={setShow}>
        <div class="flex flex-col h-full p-3 gap-2">
          <h3 class="text-lg">Modal Content Title</h3>
          <div class="flex-1">Hello</div>
          <div class="flex justify-end">
            <button
              class="antd-btn antd-btn-default px-2"
              onClick={() => setShow(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TestPopover() {
  const placements = new Map<number, Placement>([
    [1, "top-start"],
    [2, "top"],
    [3, "top-end"],
    [5, "left-start"],
    [10, "left"],
    [15, "left-end"],
    [9, "right-start"],
    [14, "right"],
    [19, "right-end"],
    [21, "bottom-start"],
    [22, "bottom"],
    [23, "bottom-end"],
  ]);

  return (
    <div class="flex flex-col gap-3 p-2 border w-sm">
      <h1 class="text-xl">Popover</h1>
      <div class="flex justify-center gap-2">
        <div class="grid grid-cols-5 p-2 gap-2 w-sm">
          <Index each={range(25).map((i) => placements.get(i))}>
            {(item) => renderItem(item())}
          </Index>
        </div>
      </div>
    </div>
  );

  function renderItem(placement?: Placement) {
    if (!placement) {
      return <span />;
    }

    return (
      <Popover
        placement={placement}
        reference={(ctx) => (
          <button
            class={cls(
              "antd-btn antd-btn-default py-1 px-2 text-sm",
              ctx.open() && "text-colorPrimaryActive border-colorPrimaryActive"
            )}
          >
            {placement.replace("-", "\n")}
          </button>
        )}
        floating={(ctx) => (
          <Transition
            show={ctx.open()}
            style={ctx.floatingStyle()}
            class="transition duration-150"
            enterFrom="scale-80 opacity-0"
            enterTo="scale-100 opacity-100"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-80 opacity-0"
          >
            <div class="flex flex-col gap-2 px-3 py-2 w-[150px] antd-floating text-sm">
              <div>Content</div>
              <button
                class="antd-btn antd-btn-default"
                onClick={() => ctx.setOpen(false)}
              >
                Close
              </button>
            </div>
          </Transition>
        )}
      />
    );
  }
}
