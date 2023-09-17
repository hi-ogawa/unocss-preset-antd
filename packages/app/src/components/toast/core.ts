//
// framework agnostic toast core logic
//

// HTMLElement based api?
// - setContainerElement
// - setItemElement
// - track unmount for remove
// - track mouseover for pause

export type ToastItem<T> = {
  id: string;
  step: number;
  data: T;
};

// animation can utilize intermediate step between [0, 1] and [1, oo)
export const TOAST_STEP = {
  START: 0,
  DISMISS: 1,
};

export class ToastManager<T> {
  public items: ToastItem<T>[] = [];

  create(data: T) {
    this.items = [...this.items];
    this.items.push({
      id: generateId(), // TODO: support upsert by id?
      step: TOAST_STEP.START,
      data,
    });
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

  dismissAll() {
    for (const item of this.items) {
      this.dismiss(item.id);
    }
  }

  remove(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.notify();
  }

  removeAll() {
    this.items = [];
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

function generateId() {
  // prettier-ignore
  return Math.floor(Math.random() * 2 ** 50).toString(32).padStart(10, "0");
}
