import { useStableCallback } from "@hiogawa/utils-react";

export function useMergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useStableCallback((el) => {
    for (const ref of refs) {
      if (ref) {
        if (typeof ref === "function") {
          ref(el);
        } else {
          // @ts-expect-error hack readonly
          ref.current = el;
        }
      }
    }
  });
}
