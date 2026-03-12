/* eslint-disable react-hooks/rules-of-hooks */
import { type RefObject, useMemo, useState } from "react";
import { useCallback } from "react";

import type {
  FormField,
  FieldError,
  FieldValidationError,
} from "./formField.ts";

type PotentialValues<T extends Record<string, FormField<any, boolean>>> = {
  [K in keyof T]: T[K] extends FormField<any, infer O>
    ? O extends true
      ? string
      : string | undefined
    : never;
};

export type Sanitized<T extends Record<string, FormField<any, boolean>>> = {
  [K in keyof T]: T[K] extends FormField<infer V, infer O>
    ? O extends true
      ? V
      : V | undefined
    : never;
};

export type ErrorsValue<T extends FormValidator<any>> = Partial<
  Record<keyof T["definition"], FieldError>
>;

export type ValidationErrorsValue<
  T extends Record<string, FormField<any, boolean>>,
> = Partial<Record<keyof T, FieldValidationError>>;

export class FormValidator<
  const T extends Record<string, FormField<any, boolean>>,
> {
  constructor(readonly definition: T) {}

  validateAll(
    fields: PotentialValues<T>,
  ):
    | [errors: ValidationErrorsValue<T>, sanitized: undefined]
    | [errors: undefined, sanitized: Sanitized<T>] {
    const sanitized: Partial<PotentialValues<T>> = {};
    const errors: ValidationErrorsValue<T> = {};

    let invalid = false;

    for (const [key, value] of Object.entries(fields)) {
      const status = this.definition[key]?.validate(value);

      if (!status) {
        continue;
      }

      if (status.valid) {
        sanitized[key as keyof T] = status.sanitized;
      } else {
        invalid = true;
        errors[key as keyof T] = status as FieldValidationError;
      }
    }

    if (invalid) {
      return [errors, undefined];
    }

    return [undefined, sanitized as Sanitized<T>];
  }

  useErrors() {
    const [errors, setErrors] = useState<ErrorsValue<this>>({});

    const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

    return { errors, setErrors, hasErrors };
  }

  useValidate<F extends keyof PotentialValues<T>>(
    field: F,
    value: RefObject<PotentialValues<T>[F]>,
    setErrors: ReturnType<typeof this.useErrors>["setErrors"],
  ) {
    return useCallback(() => {
      const status = this.definition[field]?.validate(value.current);

      if (status && status.valid) {
        setErrors((current) => {
          const { [field]: _, ...rest } = current;
          void _;
          return { ...rest } as any;
        });
      } else {
        setErrors((current) => {
          return { ...current, [field]: status };
        });
      }
    }, [field, setErrors, value]);
  }
}
