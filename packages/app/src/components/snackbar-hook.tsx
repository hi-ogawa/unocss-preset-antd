import React from "react";
import { type ToastItemBase, ToastManager } from "./toast";

type ToastData = {
  node: React.ReactNode;
  type?: "success" | "error";
};

export type ToastItem = ToastItemBase<ToastData>;

export const useSnackbar = createUseToast<ToastData>();

function createUseToast<T>() {
  const manager = new ToastManager<T>();

  function useToast() {
    React.useSyncExternalStore(
      manager.subscribe,
      manager.getSnapshot,
      manager.getSnapshot
    );
    return manager;
  }

  return useToast;
}
