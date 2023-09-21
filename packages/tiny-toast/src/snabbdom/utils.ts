import { type VNode, eventListenersModule, init, styleModule } from "snabbdom";

export function initRender(el: Element, render: () => VNode) {
  const patch = init([styleModule, eventListenersModule]);
  let oldVnode: VNode | undefined;
  return () => {
    const vnode = render();
    patch(oldVnode ?? el, vnode);
    oldVnode = vnode;
  };
}
