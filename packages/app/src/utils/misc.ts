import React from "react";

export function cls(...args: unknown[]): string {
  return args.filter(Boolean).join(" ");
}

//
// useThemeState
//

// defined in <head> of index.html
declare let __getTheme: () => string;
declare let __setTheme: (theme: string) => void;

export function useThemeState() {
  const [state, setState] = React.useState(__getTheme);

  function setStateWrapper(state: string) {
    setState(state);
    __setTheme(state);
  }

  return [state, setStateWrapper] as const;
}
