// cheating type for convenience
export function pickBy<K extends PropertyKey, V>(
  o: Record<K, V>,
  f: (v: V, k: K) => boolean
): Record<K, V> {
  return Object.fromEntries(
    Object.entries<V>(o).filter(([k, v]) => f(v, k as any))
  ) as any;
}
