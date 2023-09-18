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

export type ReactToastItem = ToastItem<ReactToastData>;

type ReactToastOptions = Omit<ReactToastData, "render"> &
  Pick<ReactToastItem, "duration">;

const DEFAULT_OPTIONS: ReactToastOptions = {
  duration: 4000,
  position: "top-center",
  type: "blank",
};

export class ReactToastManager extends ToastManager<ReactToastData> {
  constructor(public defaultOptions?: Partial<ReactToastOptions>) {
    super();
  }

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
        ...DEFAULT_OPTIONS,
        ...this.defaultOptions,
        ...options,
        type,
      },
      {
        ...DEFAULT_OPTIONS,
        ...this.defaultOptions,
      }
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
