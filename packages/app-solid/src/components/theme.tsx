import { getTheme, setTheme } from "@hiogawa/theme-script";
import { SelectWrapper } from "./select";

export function ThemeSelect() {
  return (
    <label class="flex items-center gap-2">
      <span>Theme</span>
      <SelectWrapper
        class="antd-input p-1 py-0.5 capitalize"
        options={["system", "dark", "light"]}
        // very subtle nuance but it's not necessary to make `value` reactive by createSignal/createEffect
        // since `select.value` can be left "uncontrolled" after the first rendering.
        value={getTheme()}
        onChange={(v) => setTheme(v)}
      />
    </label>
  );
}
