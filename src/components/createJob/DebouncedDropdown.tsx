"use client";

import { useDebounce } from "@/utils/useDebounce";
import { useEffect, useState, useRef } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormSetValue,
  PathValue,
} from "react-hook-form";
import { ChevronDown, LoaderCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { cn } from "@/utils/cn";

export interface DebouncedDropdownProps<
  TFormValues extends FieldValues,
  TQueryData,
> {
  placeholder: string;
  jwtToken: string | null;
  fieldName: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  error: FieldError | undefined;
  fieldValue?: string;
  useQueryFn: (
    jwtToken: string | null,
    query: string,
  ) => {
    data?: TQueryData[];
    isLoading: boolean;
  };
  getOptionLabel: (option: TQueryData) => string;
  getOptionValue: (
    option: TQueryData,
  ) => PathValue<TFormValues, Path<TFormValues>>;
  iconUrl?: string;
  icon?: React.ReactNode;
  useTextValue?: boolean;
  disabled?: boolean;
  resetOn?: boolean;
  inputClassName?: string;
  inputTerm?: string;
  /** Render the icon on its own, without the tinted square behind it. */
  plainIcon?: boolean;
  /** Called with the whole option when the user picks one. */
  onSelectOption?: (option: TQueryData) => void;
  /** Extra row at the bottom of the open list, e.g. an "Add new" shortcut. */
  footerAction?: React.ReactNode;
}

export default function DebouncedDropdown<
  TFormValues extends FieldValues,
  TQueryData,
>({
  placeholder,
  jwtToken,
  fieldName,
  setValue,
  error,
  useQueryFn,
  getOptionLabel,
  getOptionValue,
  fieldValue,
  iconUrl,
  icon,
  inputClassName = "",
  useTextValue = false,
  disabled = false,
  resetOn = false,
  inputTerm,
  plainIcon = false,
  onSelectOption,
  footerAction,
}: DebouncedDropdownProps<TFormValues, TQueryData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [optionArray, setOptionArray] = useState<TQueryData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState(fieldValue || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQueryFn(jwtToken, debouncedSearchTerm);

  useEffect(() => {
    if (resetOn) {
      setInputValue("");
      setSearchTerm("");
      setOptionArray([]);
    }
  }, [resetOn]);

  useEffect(() => {
    if (fieldValue) {
      setInputValue(fieldValue);
    }
  }, [fieldValue]);

  useEffect(() => {
    if (data) {
      setOptionArray(data);
    } else {
      setOptionArray([]);
    }
  }, [data]);

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

  const handleSelectOption = (option: TQueryData) => {
    const valueToSet = getOptionValue(option);
    const label = getOptionLabel(option);

    setValue(fieldName, valueToSet, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setInputValue(label);
    setSearchTerm(label);
    setIsOpen(false);
    onSelectOption?.(option);
  };

  const hasLeftIcon = !!iconUrl || !!icon;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={cn(
          "flex h-[58px] w-full items-center rounded-[14px] border bg-white transition",
          error
            ? "border-red-300 focus-within:ring-2 focus-within:ring-red-100"
            : "border-[#D6DBE4] focus-within:ring-2 focus-within:ring-[#DCE9FF]",
          disabled ? "cursor-not-allowed opacity-70" : "cursor-text",
          inputClassName,
          error && "border-red-300",
        )}
        onClick={() => {
          if (!disabled) setIsOpen(true);
        }}
      >
        {hasLeftIcon && (
          <div
            className={
              plainIcon
                ? "ml-4 flex shrink-0 items-center justify-center text-[#2451D6]"
                : "ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FF]"
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
        )}

        <input
          className={`h-full w-full bg-transparent pr-3 text-[1rem] font-medium text-[#111827] outline-none placeholder:font-medium placeholder:text-[#98A2B3] ${
            hasLeftIcon ? "pl-3" : "pl-4"
          }`}
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;

            if (useTextValue) {
              setValue(fieldName, value as PathValue<TFormValues, Path<TFormValues>>, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }

            setInputValue(value);
            setSearchTerm(value);

            if (!isOpen) {
              setIsOpen(true);
            }
          }}
          type="text"
          placeholder={placeholder || ""}
          disabled={disabled}
        />

        <div className="mr-4 flex shrink-0 items-center justify-center">
          {isLoading ? (
            <LoaderCircle
              className="h-[18px] w-[18px] animate-spin text-[#94A3B8]"
              strokeWidth={2.2}
            />
          ) : (
            <ChevronDown
              className={`h-[20px] w-[20px] text-[#111827] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              strokeWidth={2.2}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-[#98A2B3]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}

          {!isLoading && optionArray.length === 0 && (
            <div className="px-3 py-3 text-sm font-medium text-[#98A2B3]">
              Search for {inputTerm || "something"} to see results
            </div>
          )}

          {!isLoading && optionArray.length > 0 && (
            <div className="space-y-1">
              {optionArray.map((option, index) => {
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

          {footerAction && (
            <div className="mt-1 border-t border-[#EEF1F6] pt-1">{footerAction}</div>
          )}
        </div>
      )}

      {error && (
        <p className="ml-1 mt-2 text-sm font-medium text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}
