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

  useMatchMedia("(prefers-color-scheme: dark)", () => {
    __setTheme(state);
  });

  return [state, setStateWrapper] as const;
}

function useMatchMedia(query: string, onChange: () => void) {
  const onChangeRef = useStableRef(onChange);

  React.useEffect(() => {
    const result = window.matchMedia(query);
    const handler = (_e: MediaQueryListEvent) => {
      onChangeRef.current();
    };
    result.addEventListener("change", handler);
    return () => {
      result.addEventListener("change", handler);
    };
  }, []);
}

function useStableRef<T>(value: T) {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}
