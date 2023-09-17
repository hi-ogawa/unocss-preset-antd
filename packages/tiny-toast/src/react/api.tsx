import type React from "react";
import { type ToastItem, ToastManager } from "../core";

export const TOAST_POSITIONS = ["bottom-left", "top-center"] as const;

export type ToastPosition = (typeof TOAST_POSITIONS)[number];

// allow interface argumentation?
export interface ReactToastData {
  node: React.ReactNode;
  duration: number;
  position: ToastPosition;
  type?: "success" | "error" | "info";
}

export type ReactToastItem = ToastItem<ReactToastData>;

export class ReactToastManager extends ToastManager<ReactToastData> {}

export function createReactToastManager() {
  return new ReactToastManager();
}

export type ReactToastContainerOptions = {
  renderAnimation?: (props: {
    item: ReactToastItem;
    toast: ReactToastManager;
    children: React.ReactNode;
  }) => React.ReactNode;
  renderItem?: (props: {
    item: ReactToastItem;
    toast: ReactToastManager;
  }) => React.ReactNode;
};
