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
          step: TOAST_STEP.START,
        },
      ]);
    }

    function update(itemId: string, newItem: Partial<SnackbarItemState>): void {
      setItems((items) => {
        items = [...items];
        const index = items.findIndex((item) => item.id === itemId);
        if (index >= 0) {
          const item = items[index];
          if (newItem.step === TOAST_STEP.REMOVE) {
            items.splice(index, 1);
          } else {
            items.splice(index, 1, { ...item, ...newItem });
          }
        }
        return items;
      });
    }

    return { items, create, update };
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
    this.update(id, { step: TOAST_STEP.DISMISS });
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

// animation can utilize intermidiate step between [0, 2]
export const TOAST_STEP = {
  START: 0,
  DISMISS: 1,
  REMOVE: 2,
};

type ToastItem<T> = {
  id: string;
  step: number;
  duration: number;
  data: T;
};
