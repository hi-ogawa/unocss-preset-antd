import { Ref } from "@solid-primitives/refs";
import { ParentProps, Setter, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { createDismissInteraction } from "./popover";
import { Transition } from "./transition";

export function Drawer(
  props: ParentProps & { open: boolean; setOpen: Setter<boolean> }
) {
  const [contentRef, setContentRef] = createSignal<HTMLElement>();
  createDismissInteraction({
    reference: () => undefined,
    floating: contentRef,
    setOpen: props.setOpen,
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
        <div class="fixed inset-0 overflow-hidden">
          <Transition
            show={props.open}
            class="duration-300 antd-floating inline-block h-full"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Ref ref={setContentRef}>{props.children}</Ref>
          </Transition>
        </div>
      </Transition>
    </Portal>
  );
}
