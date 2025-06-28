import * as Yup from "yup";
import toast from "react-hot-toast";

/**
 * Validates Formik values against a Yup schema and toasts only the first error.
 * @param schema - Yup validation schema
 * @param values - Formik form values
 * @returns Formik-compatible error object
 */
export function validateWithYupAndToast<T extends object>(
  schema: Yup.ObjectSchema<T>,
  values: T
): Partial<Record<keyof T, string>> {
  try {
    schema.validateSync(values, { abortEarly: false });
    return {};
  } catch (err: any) {
    const errors: Partial<Record<keyof T, string>> = {};

    if (err.inner && Array.isArray(err.inner)) {
      const firstError = err.inner[0];
      if (firstError) {
        const path = firstError.path as keyof T;
        const message = firstError.message;

        errors[path] = message;
        toast.error(message);
      }
    }

    return errors;
  }
}
