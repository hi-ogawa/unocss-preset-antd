import React from "react";
import { TinyProgress } from "./core";

export function TinyProgressReact(props: { loading: boolean }) {
  const [progress] = React.useState(() => new TinyProgress());

  React.useEffect(() => {
    props.loading ? progress.start() : progress.finish();
  }, [props.loading]);

  return null;
}
