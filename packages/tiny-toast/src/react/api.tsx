import type React from "react";
import { type ToastCoreOptions, type ToastItem, ToastManager } from "../core";

export const TOAST_POSITIONS = ["bottom-left", "top-center"] as const;

export type ToastPosition = (typeof TOAST_POSITIONS)[number];

export const TOAST_TYPES = [
  "success",
  "error",
  "info",
  "blank",
  "custom",
] as const;

export type ToastType = (typeof TOAST_TYPES)[number];

type RenderReactNode = (props: {
  item: ReactToastItem;
  toast: ReactToastManager;
}) => React.ReactNode;

export interface ReactToastData {
  render: RenderReactNode;
  position: ToastPosition; // TODO: move to core?
  type?: ToastType;
  style?: React.CSSProperties;
  className?: string;
}

type ReactToastOptions = Omit<ReactToastData, "render">;

export type ReactToastItem = ToastItem<ReactToastData>;

export class ReactToastManager extends ToastManager<ReactToastData> {
  // TODO: api is awkward... use constructor?
  public defaultOptions: ReactToastOptions = {
    position: "top-center",
    type: "blank",
  };

  success = createByTypeFactory("success");
  error = createByTypeFactory("error");
  info = createByTypeFactory("info");
  blank = createByTypeFactory("blank");
  custom = createByTypeFactory("custom");
}

function createByTypeFactory(type: ToastType) {
  return function (
    this: ReactToastManager,
    node: React.ReactNode | RenderReactNode,
    options?: Partial<ReactToastOptions & ToastCoreOptions>
  ) {
    this.create(
      {
        render: typeof node === "function" ? node : () => node,
        ...this.defaultOptions,
        ...options,
        type,
      },
      options
    );
  };
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
