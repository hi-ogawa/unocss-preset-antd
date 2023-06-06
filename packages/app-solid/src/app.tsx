import { tinyassert, typedBoolean } from "@hiogawa/utils";
import { resolveFirst } from "@solid-primitives/refs";
import { createSwitchTransition } from "@solid-primitives/transition-group";
import {
  ParentProps,
  Show,
  children,
  createContext,
  createMemo,
  createSignal,
  useContext,
} from "solid-js";
import { ThemeSelect } from "./components/theme";

export function App() {
  return (
    <div class="flex flex-col">
      <AppHeader />
      <div class="flex justify-center">
        <div class="flex flex-col gap-4 p-4">
          <TestForm />
          <TestTransition />
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
        <div class="text-2xl">Hello</div>
        <Transition
          enterFrom="opacity-0"
          enterTo="opacity-80"
          leaveFrom="opacity-80"
          leaveTo="opacity-0"
        >
          <Show when={show()}>
            <div class="absolute inset-0 antd-body flex items-center justify-center duration-800">
              <div class="antd-spin w-8 h-8"></div>
            </div>
            <TransitionChild
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div class="absolute inset-0 bg-colorPrimary flex items-center justify-center duration-1600">
                <div class="antd-spin w-8 h-8"></div>
              </div>
            </TransitionChild>
          </Show>
        </Transition>
      </div>
    </div>
  );
}

// cf.
// https://github.com/solidjs-community/solid-primitives/blob/876b583ed95e0c3f0a552882f3508a07fc64fca4/packages/transition-group/dev/switch-page.tsx#L19
// https://github.com/solidjs-community/solid-primitives/blob/876b583ed95e0c3f0a552882f3508a07fc64fca4/packages/transition-group/src/index.ts#L74
// https://github.com/tailwindlabs/headlessui/blob/14b8c5622661b985903371532dd0d116d6517aba/packages/%40headlessui-react/src/components/transitions/utils/transition.ts
function Transition(props: ParentProps & TransitionClassProps) {
  const el = resolveFirst(
    () => props.children,
    (item): item is HTMLElement => item instanceof HTMLElement
  );

  const resultEl = createSwitchTransition(el, {
    appear: true,

    onEnter: (el, done) => {
      queueMicrotask(() => {
        handleTransition(el, props, "enterFrom", "enterTo", done);
      });
    },

    onExit: (el, done) => {
      handleTransition(el, props, "leaveFrom", "leaveTo", done);
    },
  });

  return (
    <transitionContext.Provider value={el}>
      <>{resultEl}</>
    </transitionContext.Provider>
  );
}

function TransitionChild(props: ParentProps & TransitionClassProps) {
  const contextEl = useContext(transitionContext); // Provider is not setup at the time of `resolveFirst` of `Transition`
  if (!contextEl) {
    return null;
  }

  const currentEl = resolveFirst(
    () => props.children,
    (item): item is HTMLElement => item instanceof HTMLElement
  );

  createSwitchTransition(contextEl, {
    appear: true,

    onEnter: (_el, done) => {
      queueMicrotask(() => {
        const el = currentEl();
        if (!el) {
          done();
          return;
        }
        queueMicrotask(() => {
          handleTransition(el, props, "enterFrom", "enterTo", done);
        });
      });
    },

    onExit: (_el, done) => {
      const el = currentEl();
      if (!el) {
        done();
        return;
      }
      handleTransition(el, props, "leaveFrom", "leaveTo", done);
    },
  });

  return <>{props.children}</>;
}

const transitionContext = createContext(undefined! as () => HTMLElement | null);

interface TransitionClassProps {
  enterFrom?: string;
  enterTo?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

function handleTransition(
  el: HTMLElement,
  props: TransitionClassProps,
  from: keyof TransitionClassProps,
  to: keyof TransitionClassProps,
  done: () => void
) {
  const classes = {
    enterFrom: splitClass(props.enterFrom ?? ""),
    enterTo: splitClass(props.enterTo ?? ""),
    leaveFrom: splitClass(props.leaveFrom ?? ""),
    leaveTo: splitClass(props.leaveTo ?? ""),
  };

  el.classList.remove(...Object.values(classes).flat());
  el.classList.add(...classes[from]);
  forceStyle(el);

  addEventListenerOnce(el, "transitionend", () => done()); // TODO: fallback to setTimeout just in case?
  el.classList.remove(...classes[from]);
  el.classList.add(...classes[to]);
}

function splitClass(c: string): string[] {
  return c.split(" ").filter(typedBoolean);
}

function addEventListenerOnce<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  k: K,
  callback: (e: HTMLElementEventMap[K]) => void
) {
  const wrapper: typeof callback = (e) => {
    el.removeEventListener(k, wrapper);
    callback(e);
  };
  el.addEventListener(k, wrapper);
}

function forceStyle(el: Element) {
  tinyassert(typeof window.getComputedStyle(el).transition);
}
