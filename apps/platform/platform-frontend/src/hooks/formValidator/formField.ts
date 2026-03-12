interface AnyFieldError {
  valid: false;
}

export interface FieldValidationError extends AnyFieldError {
  kind: "empty" | "invalid";
  name: string;
  message: string;
}

interface FieldMiscError extends AnyFieldError {
  message: string;
}

export type FieldError = FieldMiscError | FieldValidationError;

interface FieldValid<T> {
  valid: true;
  name: string;
  sanitized: T | undefined;
}

type FieldStatus<T> = FieldError | FieldValid<T>;

export abstract class FormField<T, const O extends boolean> {
  abstract readonly name: string;
  abstract readonly isRequired: O;

  abstract validate(value: string | undefined): FieldStatus<T>;

  protected abstract sanitize(value: string | undefined): T | undefined;

  static text<const O extends boolean>(name: string, required: O) {
    return new TextField(name, required);
  }

  static number<const O extends boolean>(name: string, required: O) {
    return new NumberField(name, required);
  }
}

class TextField<const O extends boolean> extends FormField<string, O> {
  regex?: RegExp;
  shouldTrim?: boolean;
  shouldLowercase?: boolean;

  constructor(
    readonly name: string,
    readonly isRequired: O,
  ) {
    super();
  }

  withValidationRegex(regex: RegExp) {
    this.regex = regex;
    return this;
  }

  toBeTrimmed() {
    this.shouldTrim = true;
    return this;
  }

  toBeLowercased() {
    this.shouldLowercase = true;
    return this;
  }

  protected sanitize(value: string) {
    let _value = value;

    if (this.shouldTrim) {
      _value = _value.trim();
    }

    if (this.shouldLowercase) {
      _value = _value.toLowerCase();
    }

    return _value ? _value : undefined;
  }

  validate(value: string) {
    type Sanitized = typeof this.isRequired extends true
      ? string
      : string | undefined;

    const _value = this.sanitize(value) as Sanitized;

    if (!_value) {
      return this.isRequired
        ? ({
            valid: false,
            kind: "empty",
            name: this.name,
            message: `${this.name} non rempli`,
          } satisfies FieldValidationError)
        : ({
            valid: true,
            name: this.name,
            sanitized: _value,
          } satisfies FieldValid<string>);
    }

    if (this.regex && !this.regex.test(_value)) {
      return {
        valid: false,
        kind: "invalid",
        name: this.name,
        message: `${this.name} invalide`,
      } satisfies FieldValidationError;
    }

    return {
      valid: true,
      name: this.name,
      sanitized: _value,
    } satisfies FieldValid<string>;
  }
}

class NumberField<const O extends boolean> extends FormField<number, O> {
  constructor(
    readonly name: string,
    readonly isRequired: O,
  ) {
    super();
  }

  protected sanitize(value: string) {
    return value ? Number(value) : undefined;
  }

  validate(value: string) {
    type Sanitized = O extends true ? number : number | undefined;

    const _value = this.sanitize(value) as Sanitized;

    if (!_value) {
      return this.isRequired
        ? ({
            valid: false,
            kind: "empty",
            name: this.name,
            message: `${this.name} non rempli`,
          } satisfies FieldValidationError)
        : ({
            valid: true,
            name: this.name,
            sanitized: _value,
          } satisfies FieldValid<number>);
    }

    if (isNaN(_value)) {
      return {
        valid: false,
        kind: "invalid",
        name: this.name,
        message: `${this.name} invalide`,
      } satisfies FieldValidationError;
    }

    return {
      valid: true,
      name: this.name,
      sanitized: _value,
    } satisfies FieldValid<number>;
  }
}
