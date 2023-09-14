// copied from https://github.com/hi-ogawa/ytsub-v3/blob/2c5b5978021658260b9bdf079ecb0dc8926bd98d/app/components/misc.tsx#L178
export function SimpleSelect<T>({
  value,
  options,
  onChange,
  labelFn = String, // convenient default when `T extends string`
  keyFn = (v) => JSON.stringify({ v }), // wrap it so that `undefined` becomes `{}`
  ...selectProps
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  labelFn?: (value: T) => React.ReactNode;
  keyFn?: (value: T) => React.Key;
} & Omit<JSX.IntrinsicElements["select"], "value" | "onChange">) {
  return (
    <select
      value={options.indexOf(value)}
      onChange={(e) => onChange(options[Number(e.target.value)])}
      {...selectProps}
    >
      {options.map((option, i) => (
        <option key={keyFn(option)} value={i}>
          {labelFn(option)}
        </option>
      ))}
    </select>
  );
}
