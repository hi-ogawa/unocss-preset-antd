import type React from "react";
import { type ToastItem, ToastManager } from "../core";

export const TOAST_POSITIONS = ["bottom-left", "top-center"] as const;

export type ToastPosition = (typeof TOAST_POSITIONS)[number];

// allow interface argumentation?
export interface ReactToastData {
  node: React.ReactNode;
  position: ToastPosition;
  type?: "success" | "error" | "info";
  style?: React.CSSProperties;
  className?: string;
}

export type ReactToastItem = ToastItem<ReactToastData>;

// TODO: defaultToastData as manager option?
export class ReactToastManager extends ToastManager<ReactToastData> {}

export type ReactToastContainerOptions = {
  style?: React.CSSProperties;
  className?: string;
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
