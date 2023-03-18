import { toArraySetState } from "@hiogawa/utils-react";
import { atom, useAtom } from "jotai";

export interface SnackbarItemOptions {
  type?: "success" | "error";
}

interface SnackbarItemState {
  id: string;
  node: React.ReactNode;
  options?: SnackbarItemOptions;
  state: "show" | "dismiss-slide" | "dismiss-collapse";
}

function createUseSnackbar() {
  const itemsAtom = atom<SnackbarItemState[]>([]);

  function useSnackbar() {
    const [items, setItems] = useAtom(itemsAtom);
    const setArayState = toArraySetState(setItems);

    function create(
      node: React.ReactNode,
      options?: SnackbarItemOptions
    ): string {
      const id = String(Math.random());
      setArayState.push({
        node,
        options,
        id,
        state: "show",
      });
      return id;
    }

    function __update(
      itemId: string,
      newItem?: Partial<SnackbarItemState>
    ): void {
      const index = items.findIndex((item) => item.id === itemId);
      if (index >= 0) {
        const item = items[index];
        if (newItem) {
          setArayState.splice(index, 1, { ...item, ...newItem });
        } else {
          setArayState.splice(index, 1);
        }
      }
    }

    function dismiss(itemId: string): void {
      __update(itemId, { state: "dismiss-slide" });
    }

    function remove(itemId: string): void {
      __update(itemId);
    }

    return { items, create, __update, dismiss, remove };
  }

  return useSnackbar;
}

export const useSnackbar = createUseSnackbar();
