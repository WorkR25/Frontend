import { InputHTMLAttributes, JSX } from "react";
import { FieldError, FieldValues, Path, PathValue, RegisterOptions, UseFormRegister } from "react-hook-form";

export type InputFieldProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  fieldName: Path<T>;
  placeholder: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  icon: JSX.Element;
  other?: JSX.Element;
  validate?: RegisterOptions["validate"];
  error?: FieldError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValueFn?: (value: string)=>any ;
  fieldValue?: PathValue<T, Path<T>>;
  className?: string;
  disabled?: boolean | null;
  onChangeFn?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputClassName?: string ;
};