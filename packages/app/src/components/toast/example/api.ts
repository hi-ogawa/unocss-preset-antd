import React from "react";
import { type ToastItem, ToastManager } from "../core";

export const TOAST_POSITIONS = ["bottom-left", "top-center"] as const;
export type ToastPosition = (typeof TOAST_POSITIONS)[number];

export type ToastData = {
  node: React.ReactNode;
  duration: number;
  type?: "success" | "error" | "info";
  position: ToastPosition;
};

export type CustomToastItem = ToastItem<ToastData>;

export type CustomToastManager = ToastManager<ToastData>;

export const toast = new ToastManager<ToastData>();
