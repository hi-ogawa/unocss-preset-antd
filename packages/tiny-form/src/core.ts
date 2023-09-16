import { objectHas } from "@hiogawa/utils";

//
// form helper
//

export type TinyFormHelper<T> = {
  data: T;
  fields: { [K in keyof T]: FormFieldHelper<T[K]> };
  handleSubmit: (callback: () => void) => (e: unknown) => void;
};

type SetState<T> = (toNext: (prev: T) => T) => void;

export function createTinyForm<T extends {}>([state, setState]: readonly [
  T,
  SetState<T>
]): TinyFormHelper<T> {
  return {
    data: state,
    fields: createFieldRecordHelper([state, setState]),
    handleSubmit: (callback) => (e) => {
      if (
        objectHas(e, "preventDefault") &&
        typeof e.preventDefault === "function"
      ) {
        e.preventDefault();
      }
      callback();
    },
  };
}

//
// Proxy-based field record helper
//

type FieldRecordHelper<T> = { [K in keyof T]: FormFieldHelper<T[K]> };

function createFieldRecordHelper<T extends {}>([state, setState]: readonly [
  T,
  SetState<T>
]): FieldRecordHelper<T> {
  return new Proxy(
    {},
    {
      get(_target, p, _receiver) {
        const k = p as keyof T & string;
        return createFormFieldHelper(k, [
          state[k],
          (next) => setState((prev) => ({ ...prev, [k]: next(prev[k]) })),
        ]);
      },
    }
  ) as any;
}

//
// form field helper
//

type FormFieldHelper<T> = {
  name: string;
  value: T;
  onChange: (v: T) => void;
  // duplicate `rawProps` for easier object spread
  rawProps: () => {
    name: string;
    value: T;
    onChange: (v: T) => void;
  };
  // basic helper for input/select element
  props: (options?: { checked?: true }) => {
    name: string;
    value?: string;
    checked?: boolean;
    onChange: (e: { target: { value: string; checked?: boolean } }) => void;
  };
};

function createFormFieldHelper<T>(
  name: string,
  [state, setState]: readonly [T, SetState<T>]
): FormFieldHelper<T> {
  const rawProps = {
    name,
    value: state,
    onChange: (v: T) => setState(() => v),
  };
  return {
    ...rawProps,
    rawProps: () => rawProps,
    props: (options) =>
      options?.checked
        ? {
            name,
            checked: state as boolean,
            onChange: (e) => setState(() => e.target.checked as T),
          }
        : {
            name,
            value: state as string,
            onChange: (e) => setState(() => e.target.value as T),
          },
  };
}
