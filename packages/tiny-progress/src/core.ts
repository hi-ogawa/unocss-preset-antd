export class TinyProgress {
  // cf. https://github.com/badrap/bar-of-progress/blob/master/src/index.ts
  public styles = {
    base: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      height: "2px",
      backgroundColor: "#38f",
      pointerEvents: "none",
      transformOrigin: "0 0",
    },
    enter: {
      transition: "transform 10s cubic-bezier(0.05, 0.5, 0, 1)",
    },
    enterFrom: {
      transform: "scaleX(0)",
    },
    enterTo: {
      transform: "scaleX(0.97)",
    },
    leave: {
      transition: [
        "transform 0.1s linear",
        "filter 0.3s ease-in-out",
        "opacity 0.5s ease-in-out 0.3s",
      ].join(", "),
    },
    leaveFrom: {
      opacity: "1",
      filter: "brightness(1)",
    },
    leaveTo: {
      opacity: "0",
      filter: "brightness(1.5)",
      transform: "scaleX(1)",
    },
  } satisfies Record<string, Partial<CSSStyleDeclaration>>;

  private el: HTMLElement | undefined;

  start() {
    this.el?.remove();
    this.el = document.body.appendChild(document.createElement("div"));
    const el = this.el;
    Object.assign(
      el.style,
      this.styles.base,
      this.styles.enter,
      this.styles.enterFrom
    );
    requestAnimationFrame(() => {
      Object.assign(el.style, this.styles.enterTo);
    });
  }

  finish() {
    if (!this.el) return;
    const el = this.el;
    Object.assign(el.style, this.styles.leave, this.styles.leaveFrom);
    requestAnimationFrame(() => {
      Object.assign(el.style, this.styles.leaveTo);
    });
  }
}
