import { Ref } from "@solid-primitives/refs";
import { type ParentProps, type Setter, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { createDismissInteraction } from "./popover";
import { TransitionV2 as Transition } from "./transition";

export function Modal(
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
          appear
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
            appear
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
