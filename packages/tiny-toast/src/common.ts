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
