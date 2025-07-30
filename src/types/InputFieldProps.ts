import { InputHTMLAttributes, JSX } from "react";
import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

export type InputFieldProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  fieldName: Path<T>;
  placeholder: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  icon: JSX.Element;
  other?: JSX.Element;
  validate?: RegisterOptions["validate"];
  error?: FieldError;
  className?: string;
};