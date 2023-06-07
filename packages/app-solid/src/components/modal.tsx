import { Ref } from "@solid-primitives/refs";
import { ParentProps, createEffect, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { Transition } from "./transition";
import { onClickTarget, onDocumentEvent } from "./utils";

export function Modal(
  props: ParentProps & { open: boolean; onOpenChange: (open: boolean) => void }
) {
  // dismiss on click outside
  const [contentRef, setContentRef] = createSignal<Node>();
  createEffect(() => {
    const el = contentRef();
    if (el) {
      onClickTarget(el, (hit) => {
        if (!hit) {
          props.onOpenChange(false);
        }
      });
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
