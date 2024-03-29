import type React from "react";
import type { ToastPosition, ToastType } from "../common";
import { type ToastCoreOptions, type ToastItem, ToastManager } from "../core";

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

type ReactToastOptions = Omit<ReactToastData, "render"> & ToastCoreOptions;

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
    options?: Partial<ReactToastOptions>
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
};
