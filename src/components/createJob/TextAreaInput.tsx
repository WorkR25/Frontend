import { FieldError, FieldValues, Path, PathValue, UseFormRegister } from "react-hook-form";

interface TextareaFieldProps<T extends FieldValues> {
  icon?: React.ReactNode;
  fieldName: Path<T>;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  fieldValue?: PathValue<T, Path<T>>;
  onChangeFn: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextAreaInput<T extends FieldValues>({
  icon,
  fieldName,
  placeholder,
  register,
  error,
  fieldValue,
  onChangeFn,
}: TextareaFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-items-center">
        {icon && <span>{icon}</span>}
        <textarea
          className="border p-2 rounded-md w-full"
          placeholder={placeholder}
          defaultValue={fieldValue}
          {...register(fieldName)}
          onChange={onChangeFn}
          rows={4}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

