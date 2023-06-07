import { Ref } from "@solid-primitives/refs";
import {
  Accessor,
  ParentProps,
  createEffect,
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";
import { Portal } from "solid-js/web";
import { ThemeSelect } from "./components/theme";
import { Transition } from "./components/transition";

export function App() {
  return (
    <div class="flex flex-col">
      <AppHeader />
      <div class="flex justify-center">
        <div class="flex flex-col gap-4 p-4">
          <TestForm />
          <TestTransition />
          <TestModal />
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
      <Modal open={show()} onOpenChange={setShow}>
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

function Modal(
  props: ParentProps & { open: boolean; onOpenChange: (open: boolean) => void }
) {
  // dismiss on click outside
  const [contentRef, setContentRef] = createSignal<Node>();
  onClickTarget(contentRef, (hitInside) => {
    if (!hitInside) {
      props.onOpenChange(false);
    }
  });

  // dismiss on escape
  onDocumentEvent("keyup", (e) => {
    if (e.key === "Escape") {
      props.onOpenChange(false);
    }
  });

  return (
    <Portal>
      <Transition show={props.open} class="duration-300">
        {/* backdrop */}
        <Transition
          show={props.open}
          class="duration-300 fixed inset-0 bg-black"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        />
        {/* content */}
        <div class="fixed inset-0 overflow-hidden flex justify-center items-center">
          <Transition
            show={props.open}
            class="duration-300 transform antd-floating"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Ref ref={setContentRef}>{props.children}</Ref>
          </Transition>
        </div>
      </Transition>
    </Portal>
  );
}

function onClickTarget(
  targetFn: Accessor<Node | undefined>,
  callback: (hitInside: boolean) => void
) {
  // TODO: need to track latest accessor like this?
  // TODO: check out https://github.com/solidjs-community/solid-primitives/blob/876b583ed95e0c3f0a552882f3508a07fc64fca4/packages/event-listener/src/eventListener.ts
  let target: Node | undefined;
  createEffect(() => {
    target = targetFn();
  });

  function wrapper(e: DocumentEventMap["pointerdown"]) {
    untrack(() => {
      const hitInside = e.target instanceof Node && target?.contains(e.target);
      callback(Boolean(hitInside));
    });
  }

  document.addEventListener("pointerdown", wrapper);

  onCleanup(() => {
    document.removeEventListener("pointerdown", wrapper);
  });
}

function onDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  callback: (e: DocumentEventMap[K]) => void
) {
  // TODO: callback is assumed to be stable?
  // TODO: should wrap with `untrack`?

  document.addEventListener(type, callback);

  onCleanup(() => {
    document.removeEventListener(type, callback);
  });
}
