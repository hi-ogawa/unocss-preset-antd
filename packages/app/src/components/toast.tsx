//
// toast manager
//

export type ToastItemBase<T> = Required<ToastItemCreate<T>>;

type ToastItemCreate<T> = {
  id?: string;
  step?: number;
  duration?: number;
  data: T;
};

// animation can utilize intermidiate step between [0, 2]
export const TOAST_STEP = {
  START: 0,
  DISMISS: 1,
  REMOVE: 2,
};

export class ToastManager<T> {
  public items: ToastItemBase<T>[] = [];

  create(item: ToastItemCreate<T>) {
    this.items = [...this.items];
    this.items.push({
      id: item.id ?? generateId(),
      step: item.step ?? TOAST_STEP.START,
      duration: item.duration ?? 4000,
      data: item.data,
    });
    this.notify();
  }

  update(id: string, newItem: Partial<ToastItemBase<T>>) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index >= 0) {
      this.items = [...this.items];
      if (newItem.step === TOAST_STEP.REMOVE) {
        this.items.splice(index, 1);
      } else {
        this.items[index] = { ...this.items[index], ...newItem };
      }
      this.notify();
    }
  }

  dismiss(id: string) {
    this.update(id, { step: TOAST_STEP.DISMISS });
  }

  remove(id: string) {
    this.update(id, { step: TOAST_STEP.REMOVE });
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
