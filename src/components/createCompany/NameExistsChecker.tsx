"use client";

import { useAppSelector } from "@/lib/hooks";
import { useDebounce } from "@/utils/useDebounce";
import { Check, LoaderCircle, X, Building2 } from "lucide-react";
import React, { useEffect } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { toast } from "sonner";

function NameExistsChecker<T extends FieldValues>({
  name,
  register,
  error,
  useQueryFn,
  watch,
  companyNameExists,
  setCompanyNameExists,
  placeholder,
  validationFn,
  errorMessage,
  delay = 500,
}: {
  name: Path<T>;
  register: UseFormRegister<T>;
  error: FieldError | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useQueryFn: any;
  watch: (field: Path<T>) => string;
  companyNameExists: boolean;
  setCompanyNameExists: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationFn: (data: any) => boolean;
  errorMessage: string;
  delay?: number;
}) {
  const fieldValue = watch(name) || "";
  const trimmedValue = fieldValue.trim();
  const debouncedValue = useDebounce(trimmedValue, delay);
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const shouldCheck = debouncedValue.length > 0;
  const {
    data,
    isFetching,
    isError,
    error: queryError,
  } = useQueryFn(jwtToken, debouncedValue);

  useEffect(() => {
    if (!shouldCheck) {
      setCompanyNameExists(false);
      return;
    }

    if (data && validationFn(data)) {
      setCompanyNameExists(true);
    } else {
      if (isError) {
        setCompanyNameExists(true);
        toast.error(queryError?.message || "Something went wrong");
      } else {
        setCompanyNameExists(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, shouldCheck, setCompanyNameExists, validationFn, isError]);

  const hasError = companyNameExists || !!error;
  const showStatusIcon = trimmedValue.length > 0;

  const renderStatusIcon = () => {
    if (!showStatusIcon) return null;

    if (isFetching) {
      return (
        <LoaderCircle
          className="h-[18px] w-[18px] animate-spin text-[#94A3B8]"
          strokeWidth={2.2}
        />
      );
    }

    if (hasError) {
      return <X className="h-[18px] w-[18px] text-red-500" strokeWidth={2.4} />;
    }

    return (
      <Check className="h-[18px] w-[18px] text-emerald-500" strokeWidth={2.4} />
    );
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF3FF]">
            <Building2
              className="h-[18px] w-[18px] text-[#2B6DEB]"
              strokeWidth={2.1}
            />
          </div>
        </div>

        <input
          type="text"
          {...register(name)}
          placeholder={placeholder}
          className={`h-[58px] w-full rounded-[14px] border bg-white pl-16 pr-12 text-[1rem] font-medium text-[#111827] outline-none transition placeholder:font-medium placeholder:text-[#98A2B3] ${
            hasError
              ? "border-red-300 ring-1 ring-red-100 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-[#D6DBE4] focus:border-[#B8D1FF] focus:ring-2 focus:ring-[#DCE9FF]"
          }`}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {renderStatusIcon()}
        </div>
      </div>

      {companyNameExists && (
        <p className="ml-1 mt-2 text-sm font-medium text-red-500">
          {errorMessage || "This name already exists"}
        </p>
      )}

      {!companyNameExists && error && (
        <p className="ml-1 mt-2 text-sm font-medium text-red-500">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}

export default NameExistsChecker;
