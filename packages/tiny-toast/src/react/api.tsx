import type React from "react";
import { type ToastCoreOptions, type ToastItem, ToastManager } from "../core";

export const TOAST_POSITIONS = ["bottom-left", "top-center"] as const;

export type ToastPosition = (typeof TOAST_POSITIONS)[number];

export interface ReactToastData {
  node: React.ReactNode; // TODO: self-referential render callback (item, toast) => React.ReactNode
  position: ToastPosition; // TODO: move to core?
  type?: "success" | "error" | "info";
  style?: React.CSSProperties;
  className?: string;
}

type ReactToastOptions = Omit<ReactToastData, "node">;

export type ReactToastItem = ToastItem<ReactToastData>;

export class ReactToastManager extends ToastManager<ReactToastData> {
  public defaultOptions: ReactToastOptions = {
    position: "top-center",
  };

  // TODO: naming
  createWrapper(
    node: React.ReactNode,
    options?: Partial<ReactToastOptions & ToastCoreOptions>
  ) {
    this.create(
      {
        node,
        ...this.defaultOptions,
        ...options,
      },
      options
    );
  }
}

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
