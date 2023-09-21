import {
  type VNode,
  attributesModule,
  eventListenersModule,
  init,
} from "snabbdom";

export function initRender(el: Element, render: () => VNode) {
  const patch = init([attributesModule, eventListenersModule]);
  let oldVnode: VNode | undefined;
  return () => {
    const vnode = render();
    patch(oldVnode ?? el, vnode);
    oldVnode = vnode;
  };
}

export function batchTimeout(f: () => void, ms: number) {
  let last: { handle: ReturnType<typeof setTimeout> } | undefined;
  return () => {
    if (last) {
      clearTimeout(last.handle);
    }
    last = { handle: setTimeout(() => f(), ms) };
  };
}
