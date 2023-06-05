export function App() {
  return (
    <div class="flex justify-center p-2">
      <div class="flex flex-col gap-3 p-2 border w-sm">
        <h1 class="text-xl">Login</h1>
        <label class="flex flex-col gap-1">
          <span class="text-sm text-colorTextLabel">Username</span>
          <input class="antd-input p-1" />
        </label>
        <button class="antd-btn antd-btn-primary p-1">Submit</button>
      </div>
    </div>
  );
}
