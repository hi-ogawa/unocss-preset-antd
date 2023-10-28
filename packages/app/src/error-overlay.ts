if (import.meta.hot) {
  const hot = import.meta.hot;

  function sendError(data: unknown) {
    const error = data instanceof Error ? data : new Error("unknown");
    hot.send("runtime-error", {
      message: error.message,
      stack: error.stack,
    });
  }

  window.addEventListener("error", (evt) => {
    sendError(evt.error);
  });

  window.addEventListener("unhandledrejection", (evt) => {
    sendError(evt.reason);
  });
}
