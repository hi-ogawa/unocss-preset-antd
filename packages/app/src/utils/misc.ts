import React from "react";

export function cls(...args: unknown[]): string {
  return args.filter(Boolean).join(" ");
}

// TODO: to utils-react?
export type FunctionProps<C extends (...args: any[]) => any> = Parameters<C>[0];

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
