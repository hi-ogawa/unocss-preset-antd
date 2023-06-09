import { createEffect, createSignal, onCleanup } from "solid-js";

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

export function createMatchMedia(query: string) {
  const [matches, setMatches] = createSignal<boolean>();

  const media = window.matchMedia(query);

  const handler = () => setMatches(media.matches);
  media.addEventListener("change", handler);
  onCleanup(() => media.removeEventListener("change", handler));

  createEffect(() => handler());

  return matches;
}
