import { createTinyStore } from "@hiogawa/tiny-store";
import { useTinyStore } from "@hiogawa/tiny-store/dist/react";

export interface SnackbarItemOptions {
  type?: "success" | "error";
}

export interface SnackbarItemState {
  id: string;
  node: React.ReactNode;
  options?: SnackbarItemOptions;
  step: number;
}

export const useSnackbar = createUseSnackbar();

function createUseSnackbar() {
  const itemsStore = createTinyStore<SnackbarItemState[]>([]);

  function useSnackbar() {
    const [items, setItems] = useTinyStore(itemsStore);

    function create(node: React.ReactNode, options?: SnackbarItemOptions) {
      setItems((items) => [
        ...items,
        {
          node,
          options,
          id: generateId(),
          step: 0,
        },
      ]);
    }

    function update(
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

    function remove(itemId: string): void {
      update(itemId);
    }

    return { items, create, update, remove };
  }

  return useSnackbar;
}

function generateId() {
  return Math.floor(Math.random() * 2 ** 45)
    .toString(32)
    .padStart(9, "0");
}

// TODO: rework API for react external state
export class ToastManager<T> {
  public items: ToastItem<T>[] = [];

  create() {
    this.items;
    this.notify();
  }

  update(id: string, newItem: Partial<ToastItem<T>>) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index >= 0) {
      this.items = [...this.items];
      this.items[index] = { ...this.items[index], ...newItem };
      this.notify();
    }
  }

  dismiss(id: string) {
    this.update(id, { step: 1 });
  }

  remove(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.notify();
  }

  //
  // api for React.useSyncExternalStore
  //
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.items;

  private notify() {
    this.listeners.forEach((f) => f());
  }
}

type ToastItem<T> = {
  id: string;
  step: number;
  duration: number;
  data: T;
};
