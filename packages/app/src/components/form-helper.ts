import { objectHas } from "@hiogawa/utils";

// inspired by and simplified alternative for
// - https://github.com/react-hook-form/react-hook-form
// - https://github.com/edmundhung/conform

// TODO
// hopefully extra features can be provided on top of basic createFormHelper
// - valueAsNumber? (parse/stringify?)
// - helper for onSubmit handler preventDefault
// - form status helper (e.g. isValid, isDirty)?
// - validation (e.g. required)?
// - array helper?

//
// form helper
//

type FormHelper<T> = { [K in keyof T]: FormFieldHelper<T[K]> };

type FormHelper2<T> = {
  data: T;
  fields: { [K in keyof T]: FormFieldHelper<T[K]> };
  handleSubmit: (callback: () => void) => (e: unknown) => void;
};

type SetState<T> = (toNext: (prev: T) => T) => void;

export function createFormHelperV2<T extends {}>([state, setState]: readonly [
  T,
  SetState<T>
]): FormHelper2<T> {
  return {
    data: state,
    fields: createFormHelper([state, setState]),
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

export function createFormHelper<T extends {}>([state, setState]: readonly [
  T,
  SetState<T>
]): FormHelper<T> {
  return new Proxy(
    {},
    {
      get(_target, p, _receiver) {
        const k = p as keyof T;
        return createFormFieldHelper([
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

type FormFieldHelper<T> = BaseFormFieldHelper<T> &
  (T extends string ? StringFormFieldHelper : {}) &
  (T extends boolean ? BooleanFormFieldHelper : {});

type BaseFormFieldHelper<T> = {
  value: T;
  onChange: (v: T) => void;
};

// TODO: valueAsNumber?
type StringFormFieldHelper = {
  valueProps: () => {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
  };
};

type BooleanFormFieldHelper = {
  checkedProps: () => {
    checked: boolean;
    onChange: (e: { target: { checked: boolean } }) => void;
  };
};

function createFormFieldHelper<T>([state, setState]: [
  T,
  SetState<T>
]): FormFieldHelper<T> {
  const baseHelper: BaseFormFieldHelper<T> = {
    value: state,
    onChange: (v: T) => setState(() => v),
  };
  const stringHelper: StringFormFieldHelper = {
    valueProps: () => ({
      value: state as string,
      onChange: (e) => setState(() => e.target.value as T),
    }),
  };
  const booleanHelper: BooleanFormFieldHelper = {
    checkedProps: () => ({
      checked: state as boolean,
      onChange: (e) => setState(() => e.target.checked as T),
    }),
  };
  return { ...baseHelper, ...stringHelper, ...booleanHelper } as any;
}
