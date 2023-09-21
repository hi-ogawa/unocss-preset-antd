import { useSearchParams } from "react-router-dom";

// TOOD: make TinyStoreAdapter?
export function useUrlParam(key: string) {
  const [params, setParams] = useSearchParams();

  function get() {
    return params.get(key) ?? undefined;
  }

  function set(v: string | undefined) {
    setParams((prev) => {
      prev = new URLSearchParams(prev);
      typeof v === "string" ? prev.set(key, v) : prev.delete(key);
      return prev;
    });
  }

  return [get(), set] as const;
}
