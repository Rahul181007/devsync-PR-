import { useState } from "react";
import { ZodType } from "zod";

type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  schema: ZodType<T>,
  onSubmit: (values: T) => void | Promise<void>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Touched<T>>({});

  const validate = (vals: T): boolean => {
    const result = schema.safeParse(vals);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Errors<T> = {};

    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof T;
      if (field) {
        fieldErrors[field] = err.message;
      }
    });

    setErrors(fieldErrors);
    return false;
  };

  const handleChange = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(values);
  };

const handleSubmit = async () => {

  const allTouched = Object.keys(values).reduce((acc, key) => {
    acc[key as keyof T] = true;
    return acc;
  }, {} as Touched<T>);

  setTouched(allTouched);

  const isValid = validate(values);
  if (!isValid) return;

  await onSubmit(values);
};

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    reset,
  };
}