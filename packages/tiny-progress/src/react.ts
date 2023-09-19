import React from "react";
import { TinyProgress } from "./core";

export function useTinyProgress(props: {
  show: boolean;
  config?: (progress: TinyProgress) => void;
}) {
  const [progress] = React.useState(() => {
    const progress = new TinyProgress();
    props.config?.(progress);
    return progress;
  });

  React.useEffect(() => {
    props.show ? progress.start() : progress.finish();
  }, [props.show]);

  React.useEffect(() => {
    () => {
      progress.finish();
    };
  }, []);
}
