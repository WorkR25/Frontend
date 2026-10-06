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

function NameExistsChecker<T extends FieldValues>({
  name,
  register,
  error,
  useQueryFn,
  watch,
  companyNameExists,
  setCompanyNameExists,
  placeholder,
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
}) {
  const fieldValue = watch(name) || "";
  const trimmedValue = fieldValue.trim();
  const debouncedValue = useDebounce(trimmedValue, 500);
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const shouldCheck = debouncedValue.length > 0;
  const { data, isFetching, isError } = useQueryFn(jwtToken, debouncedValue);

  useEffect(() => {
    if (!shouldCheck) {
      setCompanyNameExists(false);
      return;
    }

    if (data && data.id) {
      setCompanyNameExists(true);
    } else {
      setCompanyNameExists(false);
    }
  }, [data, shouldCheck, setCompanyNameExists]);

  useEffect(() => {
    if (isError) {
      setCompanyNameExists(false);
    }
  }, [isError, setCompanyNameExists]);

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
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <div className="flex items-center justify-center">
            <Building2
              className="h-[18px] w-[18px] text-[#2451D6]"
              strokeWidth={2.1}
            />
          </div>
        </div>

        <input
          type="text"
          {...register(name)}
          placeholder={placeholder}
          className={`h-[52px] w-full rounded-[14px] border-[1.5px] bg-white pl-12 pr-12 text-[15px] font-semibold text-[#0F172A] outline-none transition placeholder:font-medium placeholder:text-[#8A93A6] ${
            hasError
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
              : "border-[#E4E8F0] focus:border-[#2451D6] focus:ring-4 focus:ring-[#2451D6]/10"
          }`}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {renderStatusIcon()}
        </div>
      </div>

      {companyNameExists && (
        <p className="ml-1 mt-2 text-sm font-medium text-red-500">
          Company name already exists
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
