export function App() {
  return (
    <div class="flex justify-center">
      <div class="flex flex-col gap-4 p-4">
        <TestForm />
        <div class="border-t"></div>
        <ThemeSelect />
      </div>
    </div>
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
      <select
        class="antd-input p-1"
        value={__themeGet()}
        onChange={(e) => {
          __themeSet(e.target.value);
        }}
      >
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </label>
  );
}

declare let __themeSet: (theme: string) => void;
declare let __themeGet: () => string;
