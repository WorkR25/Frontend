import { InputFieldProps } from "@/types/InputFieldProps";
import { cn } from "@/utils/cn";
import { FieldValues } from "react-hook-form";

export default function InputField<T extends FieldValues>({
  register,
  fieldName,
  placeholder,
  type = "text",
  icon,
  validate,
  other,
  error,
  className = "",
}: InputFieldProps<T>) {
  return (
    <div className={cn("relative w-full", className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E] pointer-events-none">
          {icon}
        </div>
      )}
      <input
        {...register(fieldName, { required: true, validate: validate })}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-[#E0E0E0]"
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error.message || "This field is required"}
        </p>
      )}
      {other}
    </div>
  );
}
