"use client";

// import InputField from "../InputField";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  FormProvider,
  Path,
  PathValue,
  useForm,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Building2,
  School,
  IndianRupee,
  CodeXml,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import useSignup from "@/utils/useSignup";
import {
  ctcOptions,
  domainOptions,
  fresherOptions,
} from "@/utils/signup.utils";
import SignupTextInput from "./SignupTextInput";

type FormValues = z.infer<typeof SignUpFormSchema>;

export default function SignUpForm() {
  const router = useRouter();

  return (
    <div className="relative  w-full h-full p-3 grid grid-rows-[auto_1fr_auto]">
      <div className="flex justify-center px-6 pt-3">
        <Image
          src="/WorkR-Full-Logo2.png"
          alt="photo"
          width={80}
          height={80}
          className="h-auto w-[100px]"
          priority
        />
      </div>

      <div className="flex h-full items-center justify-center px-6 min-h-0">
        <div className="w-full  max-h-full max-w-[440px] text-center flex flex-col min-h-0">
          <div className="shrink-0">
            <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-[#263243] sm:text-[28px]">
              Create Your Account
            </h1>
            <p className="text-[12px] font-normal text-[#66788C]">
              {"Welcome to Workr! Let's get started by creating your Account"}
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <Form />
          </div>
        </div>
      </div>

      <div className="pb-4 text-center text-[15px] text-[#445366]">
        <span>Already have an account? </span>
        <button
          className="font-medium text-[#1681D8] transition hover:cursor-pointer hover:text-[#0D63AA]"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

function Form() {
  const methods = useForm<FormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const router = useRouter();
  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate, isPending, isSuccess } = useSignup();

  useEffect(() => {
    if (isSuccess) {
      router.push(returnUrl || "/dashboard");
    }
  }, [isSuccess, router, returnUrl]);

  const onSubmit = (formData: FormValues) => {
    mutate(formData, {
      onSuccess: () => {
        router.push(returnUrl || "/dashboard");
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto space-y-1.5 pt-3 rounded-lg font-poppins text-sm px-2"
      >
        {/* {isError ? (<ErrorPopup message="Error while Siging up" />):(<></>)} */}

        {/* <InputField
          register={register}
          fieldName="fullName"
          placeholder="Full Name"
          type="text"
          icon={<User size={20} />}
          error={errors.fullName}
        /> */}

        {/* Full Name */}
        <SignupTextInput
          register={register}
          fieldName="fullName"
          placeholder="Full Name"
          icon={<User size={20} strokeWidth={2.1} />}
          error={errors.fullName}
        />

        {/* <InputField
          register={register}
          fieldName="phoneNo"
          placeholder="Phone No."
          type="text"
          icon={<Phone size={20} />}
          error={errors.phoneNo}
        /> */}

        {/* Phone No. */}
        <SignupTextInput
          register={register}
          fieldName="phoneNo"
          placeholder="Phone No."
          icon={<Phone size={20} strokeWidth={2.1} />}
          error={errors.phoneNo}
        />

        {/* <InputField
          register={register}
          fieldName="email"
          placeholder="Email Address"
          type="email"
          icon={<Mail size={20} />}
          error={errors.email}
        /> */}

        {/* Email Address */}
        <SignupTextInput
          register={register}
          fieldName="email"
          placeholder="Email Address"
          icon={<Mail size={20} strokeWidth={2.1} />}
          error={errors.email}
        />

        {/* <InputField
          register={register}
          fieldName="graduationYear"
          placeholder="Graduation Year"
          type="number"
          icon={<Calendar size={20} />}
          error={errors.graduationYear}
        /> */}

        {/* Graduation Year */}
        <SignupTextInput
          register={register}
          fieldName="graduationYear"
          placeholder="Graduation Year"
          icon={<Calendar size={20} strokeWidth={2.1} />}
          error={errors.graduationYear}
        />

        {/* Fresher options */}
        {/* <DropDownField
          name="details"
          options={fresherOptions}
          defaultValue="Select Student or Working Professional"
        /> */}

        <SignupDropdown
          error={errors.details}
          fieldName="details"
          optionArray={fresherOptions}
          getOptionLabel={(option) => option}
          getOptionValue={(option) => option}
          placeholder="Student or Professional"
          setValue={setValue}
          fieldValue=""
          icon={<School size={20} />}
        />
        {/* {errors.details?.message && (
          <p className="text-[#E04B40] text-xs">{errors.details.message}</p>
        )} */}

        {watch("details") === "Working Professional" && (
          <>
            {/* Current Company */}
            {/* <InputField
              register={register}
              fieldName="currentCompany"
              placeholder="Current Company"
              type="text"
              icon={<Building2 size={20} />}
              error={errors.currentCompany}
            /> */}

            {/* Current Company */}
            <SignupTextInput
              register={register}
              fieldName="currentCompany"
              placeholder="Current Company Name"
              icon={<Building2 size={20} strokeWidth={2.1} />}
              error={errors.currentCompany}
            />

            <SignupDropdown
              error={errors.currentCtc}
              fieldName="currentCtc"
              optionArray={ctcOptions}
              getOptionLabel={(option) => option}
              getOptionValue={(option) => option}
              placeholder="Select Current CTC Range"
              setValue={setValue}
              fieldValue=""
              icon={<IndianRupee size={20} />}
            />
          </>
        )}

        {/* Domain Dropdown options */}
        {/* <DropDownField
          name="domain"
          options={domainOptions}
          defaultValue="Select Domain"
        /> */}

        <SignupDropdown
          error={errors.domain}
          fieldName="domain"
          optionArray={domainOptions}
          getOptionLabel={(option) => option}
          getOptionValue={(option) => option}
          placeholder="Select Domain"
          setValue={setValue}
          fieldValue=""
          icon={<CodeXml size={20} />}
        />

        {/* <InputField
          register={register}
          fieldName="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          icon={<Lock size={20} />}
          error={errors.password}
          other={
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          }
        /> */}
        <div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
              <Lock size={20} strokeWidth={2.1} />
            </span>

            <input
              {...register("password")}
              onChange={(e) => {
                setValue("password", e.target.value, { shouldValidate: true });
              }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="h-[44px] w-full rounded-[14px] border border-[#D7E4F0] bg-white pl-[47px] pr-14 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF]"
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#243446] hover:cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={21} strokeWidth={2.1} />
              ) : (
                <Eye size={21} strokeWidth={2.1} />
              )}
            </button>
          </div>

          {errors.password?.message && (
            <p className="mt-2 text-left text-xs text-[#E04B40]">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* <InputField
          register={register}
          fieldName="confirmPassword"
          placeholder="Confirm Password"
          type={showConfirm ? "text" : "password"}
          icon={<Lock size={20} />}
          error={errors.confirmPassword}
          other={
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          }
          validate={(value) => value === password}
        /> */}

        <div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
              <Lock size={20} strokeWidth={2.1} />
            </span>

            <input
              {...register("confirmPassword")}
              onChange={(e) => {
                setValue("confirmPassword", e.target.value, {
                  shouldValidate: true,
                });
              }}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="h-[44px] w-full rounded-[14px] border border-[#D7E4F0] bg-white pl-[47px] pr-14 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF]"
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#243446] hover:cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <EyeOff size={21} strokeWidth={2.1} />
              ) : (
                <Eye size={21} strokeWidth={2.1} />
              )}
            </button>
          </div>

          {errors.confirmPassword?.message && (
            <p className="mt-2 text-left text-xs text-[#E04B40]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            !!errors.confirmPassword ||
            !!errors.password ||
            !!errors.email ||
            !!errors.fullName ||
            !!errors.phoneNo
          }
          className={`sticky bottom-0 z-50 mt-1 h-[40px] w-full rounded-[12px] text-[17px] font-semibold text-white transition ${
            errors.confirmPassword ||
            errors.password ||
            errors.email ||
            errors.fullName ||
            errors.phoneNo
              ? "cursor-not-allowed bg-[#C8D6E4]"
              : "cursor-pointer bg-[linear-gradient(90deg,#0F67B8_0%,#1681D8_55%,#0D72CC_100%)] shadow-[0_10px_24px_rgba(22,129,216,0.24)] hover:brightness-[1.03]"
          }`}
        >
          {isPending || isSuccess ? "Signing Up" : "Sign up"}
        </button>
      </form>
    </FormProvider>
  );
}

export interface DropdownProps<TFormValues extends FieldValues, TOption> {
  optionArray: TOption[] | undefined;
  fieldName: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  error: FieldError | undefined;
  placeholder: string;
  getOptionLabel: (option: TOption) => string;
  getOptionValue: (
    option: TOption,
  ) => PathValue<TFormValues, Path<TFormValues>>;
  iconUrl?: string;
  icon?: React.ReactNode;
  fieldValue?: string;
  resetOn?: boolean;
  inputClassName?: string;
}

function SignupDropdown<TFormValues extends FieldValues, TOption>({
  optionArray,
  fieldName,
  setValue,
  error,
  placeholder,
  getOptionLabel,
  getOptionValue,
  fieldValue,
  iconUrl,
  icon,
  resetOn = false,
  inputClassName = "",
}: DropdownProps<TFormValues, TOption>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    fieldValue || null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resetOn) {
      setSelectedLabel(null);
    }
  }, [resetOn]);

  useEffect(() => {
    if (fieldValue) {
      setSelectedLabel(fieldValue);
    }
  }, [fieldValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: TOption) => {
    const value = getOptionValue(option);
    const label = getOptionLabel(option);

    setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedLabel(label);
    setIsOpen(false);
  };

  const hasLeftIcon = !!iconUrl || !!icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-[44px] cursor-pointer w-full items-center rounded-[18px] border bg-white text-left transition outline-none ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-100"
            : "border-[#D6DBE4] focus:ring-2 focus:ring-[#DCE9FF]"
        } ${inputClassName}`}
      >
        {hasLeftIcon && (
          <div className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-[14px] bg-[#EAF3FF]">
            {iconUrl ? (
              <Image
                alt=""
                src={iconUrl}
                width={18}
                height={18}
                className="h-[18px] w-[18px] object-contain"
              />
            ) : (
              <span className="flex items-center justify-center text-[#2B6DEB]">
                {icon}
              </span>
            )}
          </div>
        )}

        <div
          className={`flex w-full items-center justify-between ${
            hasLeftIcon ? "pl-3" : "pl-4"
          } pr-4`}
        >
          <span
            className={`truncate text-[1rem]  ${
              selectedLabel ? "text-[#111827]" : "text-[#98A2B3]"
            }`}
          >
            {selectedLabel || placeholder}
          </span>

          <ChevronDown
            className={`h-[20px] w-[20px] shrink-0 text-[#111827] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            strokeWidth={2.2}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
          {optionArray && optionArray.length === 0 && (
            <div className="px-3 py-3 text-sm font-medium text-[#98A2B3]">
              No results found
            </div>
          )}

          {optionArray?.map((option, index) => {
            const label = getOptionLabel(option);

            return (
              <button
                type="button"
                key={index}
                onClick={() => handleSelectOption(option)}
                className="block w-full cursor-pointer rounded-xl px-3 py-3 text-left text-[0.98rem] font-medium text-[#374151] transition hover:bg-[#F3F6FB]"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-2 text-left text-xs text-[#E04B40]">{error.message}</p>
      )}
    </div>
  );
}

// function SignupTextInput<T extends FieldValues>({
//   register,
//   error,
//   fieldName,
//   placeholder,
//   icon,
// }: {
//   register: UseFormRegister<T>;
//   error: FieldError | undefined;
//   fieldName: Path<T>;
//   placeholder: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div>
//       <div className="relative">
//         <span className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
//           {/* <User size={20} strokeWidth={2.1} /> */}
//           {icon}
//         </span>

//         <input
//           {...register(fieldName)}
//           type="text"
//           placeholder={placeholder}
//           className="h-[40px] w-full rounded-[14px] border border-[#D7E4F0] bg-white pl-[47px] pr-4 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF]"
//         />
//       </div>

//       {error && error?.message && (
//         <p className="mt-2 text-left text-xs text-[#E04B40]">{error.message}</p>
//       )}
//     </div>
//   );
// }
