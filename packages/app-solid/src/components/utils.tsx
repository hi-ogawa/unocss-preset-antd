import { Index, splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

export function SelectWrapper<T>(
  allProps: {
    options: readonly T[];
    value: T;
    onChange: (value: T) => void;
    labelFn?: (value: T) => JSX.Element;
  } & Omit<JSX.HTMLElementTags["select"], "value" | "onChange">
) {
  const [props, selectProps] = splitProps(allProps, [
    "value",
    "options",
    "onChange",
    "labelFn",
  ]);

  return (
    <select
      value={props.options.indexOf(props.value)}
      onChange={(e) => props.onChange(props.options[Number(e.target.value)])}
      {...selectProps}
    >
      <Index each={props.options}>
        {(option, i) => (
          <option value={i}>{(props.labelFn ?? String)(option())}</option>
        )}
      </Index>
    </select>
  );
}

export function cls(...args: unknown[]): string {
  return args.filter(Boolean).join(" ");
}
