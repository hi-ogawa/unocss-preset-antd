import { ReactToastManager } from "@hiogawa/tiny-toast/dist/react";

export const toast = new ReactToastManager();
toast.defaultOptions.className = "!antd-floating";
