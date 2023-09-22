import { cls } from "./utils";

// TODO: support all 6 positions
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

export const TOAST_TYPE_ICONS = {
  // https://remixicon.com/icon/checkbox-circle-fill
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path></svg>`,
  // https://remixicon.com/icon/close-circle-fill
  error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path></svg>`,
  // https://remixicon.com/icon/information-fill
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path></svg>`,
};

export const TOAST_TYPE_ICON_COLORS = {
  success: `#61d345`,
  error: `#ff4b4b`,
  info: `#1677ff`,
};

// type-safe styles assignment
export const styleAssign = Object.assign<
  Partial<CSSStyleDeclaration>,
  Partial<CSSStyleDeclaration>
>;

// default animation
export function slideScaleCollapseTransition({
  position,
}: {
  position: ToastPosition;
}) {
  // steps
  // - slide out + scale down + collapse
  // - slide in + scale up + uncollapse
  return {
    out: (el: HTMLElement) => {
      styleAssign(el.style, {
        height: "0px",
        opacity: "0",
        transform: cls(
          "scale(0)",
          position === "bottom-left" && "translateY(120%)",
          position === "top-center" && "translateY(-120%)"
        ),
      });
    },
    in: (el: HTMLElement) => {
      styleAssign(el.style, {
        opacity: "1",
        transform: "scale(1) translateY(0)",
      });
      if (el.firstElementChild) {
        el.style.height = el.firstElementChild.clientHeight + "px";
      }
    },
    reset: (el: HTMLElement) => {
      el.style.height = "";
    },
  };
}
