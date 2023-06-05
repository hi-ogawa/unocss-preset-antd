import { Index, JSX, splitProps } from "solid-js";

export function App() {
  return (
    <div class="flex flex-col">
      <AppHeader />
      <div class="flex justify-center">
        <div class="flex flex-col gap-4 p-4">
          <TestForm />
        </div>
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <header class="flex p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <h1 class="text-lg">Examples</h1>
      <span class="flex-1"></span>
      <ThemeSelect />
    </header>
  );
}

function TestForm() {
  return (
    <div class="flex flex-col gap-3 p-2 border w-sm">
      <h1 class="text-xl">Login</h1>
      <label class="flex flex-col gap-1">
        <span class="text-sm text-colorTextLabel">Username</span>
        <input class="antd-input p-1" />
      </label>
      <button class="antd-btn antd-btn-primary p-1">Submit</button>
    </div>
  );
}

function ThemeSelect() {
  return (
    <label class="flex items-center gap-2">
      <span>Theme</span>
      <SelectWrapper
        class="antd-input p-1 py-0.5 capitalize"
        options={["system", "dark", "light"]}
        value={__themeGet()}
        onChange={(v) => __themeSet(v)}
      />
    </label>
  );
}

declare let __themeSet: (theme: string) => void;
declare let __themeGet: () => string;

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
