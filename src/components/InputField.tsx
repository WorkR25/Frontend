import { InputFieldProps } from "@/types/InputFieldProps";
import { cn } from "@/utils/cn";
import Image from "next/image";
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
  setValueFn,
  fieldValue,
  iconUrl,
  disabled,
  onChangeFn,
  inputClassName,
  plainIcon = false,
}: InputFieldProps<T>) {
  const hasLeftIcon = !!icon || !!iconUrl;

  return (
    <div>
      <div className={cn("relative w-full", className)}>
        {hasLeftIcon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <div
              className={
                plainIcon
                  ? "flex items-center justify-center text-[#2451D6]"
                  : "flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF3FF]"
              }
            >
              {iconUrl ? (
                <Image
                  alt=""
                  src={iconUrl}
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] object-contain"
                />
              ) : (
                <span className={cn("flex items-center justify-center", plainIcon ? "text-[#2451D6]" : "text-[#2B6DEB]")}>
                  {icon}
                </span>
              )}
            </div>
          </div>
        )}

        <input
          {...register(fieldName, {
            required: true,
            validate,
            setValueAs: setValueFn,
          })}
          type={type}
          placeholder={placeholder}
          defaultValue={fieldValue ?? ""}
          onChange={(e) => {
            register(fieldName).onChange(e);
            onChangeFn?.(e);
          }}
          aria-invalid={!!error}
          disabled={disabled ?? false}
          className={cn(
            "h-[58px] w-full rounded-[14px] border bg-white pr-4 text-[1rem] font-medium text-[#111827] outline-none transition placeholder:font-medium placeholder:text-[#98A2B3]",
            hasLeftIcon ? (plainIcon ? "pl-12" : "pl-16") : "pl-4",
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-100"
              : "border-[#D6DBE4] focus:border-[#B8D1FF] focus:ring-2 focus:ring-[#DCE9FF]",
            disabled ? "cursor-not-allowed opacity-70" : "",
            inputClassName,
          )}
        />

        {other}
      </div>

      {error && (
        <p className="ml-1 mt-2 text-sm font-medium text-red-500">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}
