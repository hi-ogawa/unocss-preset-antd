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
  value: T;
  onChange: (v: T) => void;
  // separate `rawProps` for easier object spread
  rawProps: () => {
    value: T;
    onChange: (v: T) => void;
  };
  // helper for input/select element
  props: (options?: FormFieldOptions<T>) => {
    name: string;
    value?: string;
    checked?: boolean;
    onChange: (e: { target: { value: string; checked?: boolean } }) => void;
  };
};

type FormFieldOptions<T> = {
  /* use `checked` attribute instead of `value` attribute */
  checked?: boolean;
  // there are many caveats when dealing with controlled input with forced validation
  // but it's still conveninent for some simple use cases
  // cf. https://github.com/solidjs/solid/issues/1756
  transform?: {
    toValue: (v: T) => string;
    fromValue: (v: string) => T;
  };
};

function createFormFieldHelper<T>(
  name: string,
  [state, setState]: readonly [T, SetState<T>]
): FormFieldHelper<T> {
  const rawProps = {
    value: state,
    onChange: (v: T) => setState(() => v),
  };
  return {
    ...rawProps,
    rawProps: () => rawProps,
    props(options) {
      if (options?.checked) {
        return {
          name,
          checked: state as boolean,
          onChange: (e) => setState(() => e.target.checked as T),
        };
      }
      const toValue = options?.transform?.toValue ?? ((v) => v as string);
      const fromValue = options?.transform?.fromValue ?? ((v) => v as T);
      return {
        name,
        value: toValue(state),
        onChange: (e) => setState(() => fromValue(e.target.value)),
      };
    },
  };
}
