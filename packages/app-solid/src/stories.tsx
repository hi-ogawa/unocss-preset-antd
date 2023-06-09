import type { Placement } from "@floating-ui/dom";
import { range } from "@hiogawa/utils";
import { Ref } from "@solid-primitives/refs";
import { Index, Show, createSignal } from "solid-js";
import { Modal } from "./components/modal";
import { FloatingArrow, Popover } from "./components/popover";
import { Transition } from "./components/transition";
import { cls } from "./components/utils";

export function StoryForm() {
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

export function StoryTransition() {
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

export function StoryModal() {
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

export function StoryPopover() {
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
        reference={({ ctx }) => (
          <button
            class={cls(
              "antd-btn antd-btn-default py-1 px-2 text-sm",
              ctx.open() && "text-colorPrimaryActive border-colorPrimaryActive"
            )}
          >
            {placement.replace("-", "\n")}
          </button>
        )}
        floating={({ ctx, arrowCtx }) => (
          <Transition
            show={ctx.open()}
            style={ctx.floatingStyle()}
            class="transition duration-150"
            enterFrom="scale-80 opacity-0"
            enterTo="scale-100 opacity-100"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-80 opacity-0"
          >
            <div class="antd-floating">
              <Show when={ctx.placement()}>
                {(placement) => (
                  <Ref ref={arrowCtx.ref}>
                    <FloatingArrow
                      style={arrowCtx.style()}
                      placement={placement()}
                    />
                  </Ref>
                )}
              </Show>
              <div class="flex flex-col gap-2 px-3 py-2 w-[150px] text-sm">
                <div>Content</div>
                <button
                  class="antd-btn antd-btn-default"
                  onClick={() => ctx.setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition>
        )}
      />
    );
  }
}
