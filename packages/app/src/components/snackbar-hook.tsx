import { createTinyStore } from "@hiogawa/tiny-store";
import { useTinyStore } from "@hiogawa/tiny-store/dist/react";
import { toArraySetState } from "@hiogawa/utils-react";

export interface SnackbarItemOptions {
  type?: "success" | "error";
}

export interface SnackbarItemState {
  id: string;
  node: React.ReactNode;
  options?: SnackbarItemOptions;
  state: "show" | "dismiss-slide" | "dismiss-collapse";
}

function createUseSnackbar() {
  const itemsStore = createTinyStore<SnackbarItemState[]>([]);

  function useSnackbar() {
    const [items, setItems] = useTinyStore(itemsStore);
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
      setItems((items) => {
        items = [...items];
        const index = items.findIndex((item) => item.id === itemId);
        if (index >= 0) {
          const item = items[index];
          if (newItem) {
            items.splice(index, 1, { ...item, ...newItem });
          } else {
            items.splice(index, 1);
          }
        }
        return items;
      });
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
