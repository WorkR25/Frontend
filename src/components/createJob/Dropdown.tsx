"use client";

import { useState, useRef, useEffect } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormSetValue,
  PathValue,
} from "react-hook-form";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React from "react";

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

export default function Dropdown<TFormValues extends FieldValues, TOption>({
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
        className={`flex h-[58px] cursor-pointer w-full items-center rounded-[18px] border bg-white text-left transition outline-none ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-100"
            : "border-[#D6DBE4] focus:ring-2 focus:ring-[#DCE9FF]"
        } ${inputClassName}`}
      >
        {hasLeftIcon && (
          <div className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EAF3FF]">
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
            className={`truncate text-[1rem] font-medium ${
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
