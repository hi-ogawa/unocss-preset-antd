export function cls(...args: unknown[]): string {
  return args.filter(Boolean).join(" ");
}

// TODO: to utils-react?
export type FunctionProps<C extends (...args: any[]) => any> = Parameters<C>[0];
