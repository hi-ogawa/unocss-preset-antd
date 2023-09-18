import { PauseableTimeout, generateId } from "./utils";

export type ToastItem<T> = {
  id: string;
  step: number;
  duration: number;
  dismissTimeout: PauseableTimeout;
  data: T; // feels awkward to be aware of `data`...
};

// animation can utilize intermediate step between [0, 1] and [1, oo)
export const TOAST_STEP = {
  START: 0,
  DISMISS: 1,
};

export class ToastManager<T> {
  public items: ToastItem<T>[] = [];
  public paused = false;
  public defaultOptions = {
    duration: 4000,
  };

  create(
    data: T,
    options?: {
      duration?: number;
    }
  ) {
    const duration = options?.duration ?? this.defaultOptions.duration;
    const item: ToastItem<T> = {
      id: generateId(), // TODO: support upsert by id?
      step: TOAST_STEP.START,
      duration,
      dismissTimeout: new PauseableTimeout(
        () => this.dismiss(item.id),
        duration
      ),
      data,
    };
    if (!this.paused) {
      item.dismissTimeout.start();
    }
    this.items = [...this.items, item];
    this.notify();
  }

  // TODO: SetAction
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

  pause(paused: boolean) {
    this.paused = paused;
    for (const item of this.items) {
      if (paused) {
        item.dismissTimeout.stop();
      } else {
        item.dismissTimeout.start();
      }
    }
    this.notify();
  }

  //
  // api for React.useSyncExternalStore
  //

  private listeners = new Set<() => void>();
  private snapshot = {};

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.snapshot;

  notify() {
    this.snapshot = {};
    this.listeners.forEach((f) => f());
  }
}
