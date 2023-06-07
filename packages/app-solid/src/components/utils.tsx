import { onCleanup } from "solid-js";

export function cls(...args: unknown[]): string {
  return args.filter(Boolean).join(" ");
}

export function onClickTarget(target: Node, callback: (hit: boolean) => void) {
  onDocumentEvent("pointerdown", (e) => {
    const hit = e.target instanceof Node && target.contains(e.target);
    callback(Boolean(hit));
  });
}

export function onDocumentEvent<K extends keyof DocumentEventMap>(
  type: K,
  callback: (e: DocumentEventMap[K]) => void
) {
  document.addEventListener(type, callback);

  onCleanup(() => {
    document.removeEventListener(type, callback);
  });
}
