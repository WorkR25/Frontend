import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

export default function SignupTextInput<T extends FieldValues>({
  register,
  error,
  fieldName,
  placeholder,
  icon,
}: {
  register: UseFormRegister<T>;
  error: FieldError | undefined;
  fieldName: Path<T>;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
          {/* <User size={20} strokeWidth={2.1} /> */}
          {icon}
        </span>

        <input
          {...register(fieldName)}
          type="text"
          placeholder={placeholder}
          className="h-[44px] w-full rounded-[14px] border border-[#D7E4F0] bg-white pl-[47px] pr-4 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF]"
        />
      </div>

      {error && error?.message && (
        <p className="mt-2 text-left text-xs text-[#E04B40]">{error.message}</p>
      )}
    </div>
  );
}
