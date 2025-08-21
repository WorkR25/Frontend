'use client';

import { useEffect, useState, useRef } from "react";
import { FieldError, FieldValues, Path, UseFormSetValue, Merge, PathValue } from "react-hook-form";
import { useDebounce } from "@/utils/useDebounce";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export interface MultiSelectDropdownProps<
  TFormValues extends FieldValues,
  TOption
> {
  setValue: UseFormSetValue<TFormValues>;
  error?: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  jwtToken: string | null;
  fieldName: Path<TFormValues>;
  useQueryFn: (
    jwtToken: string | null,
    query: string
  ) => {
    data?: TOption[];
    isLoading: boolean;
  };
  getOptionLabel: (option: TOption) => string;
  getOptionValue: (option: TOption) => string | number;
  placeholder?: string;
}

export default function MultiSelectDropdown<
  TFormValues extends FieldValues,
  TOption
>({
  setValue,
  error,
  jwtToken,
  fieldName,
  useQueryFn,
  getOptionLabel,
  getOptionValue,
  placeholder = "Select options",
}: MultiSelectDropdownProps<TFormValues, TOption>) {
  const [selectedOptions, setSelectedOptions] = useState<TOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: queryResults, isLoading } = useQueryFn(jwtToken, debouncedSearchTerm);

  useEffect(() => {
    const values = selectedOptions.map(option => getOptionValue(option));
    setValue(fieldName, values as PathValue<TFormValues, Path<TFormValues>>, { shouldValidate: true, shouldDirty: true });
  }, [selectedOptions, fieldName, setValue, getOptionValue]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddOption = (option: TOption) => {
    const optionValue = getOptionValue(option);
    const isAlreadySelected = selectedOptions.some(
      (selected) => getOptionValue(selected) === optionValue
    );

    if (isAlreadySelected) {
      toast.warn("This item is already selected.");
      return;
    }
    setSelectedOptions((prev) => [...prev, option]);
    setSearchTerm("");
  };

  const handleRemoveOption = (optionToRemove: TOption) => {
    const valueToRemove = getOptionValue(optionToRemove);
    setSelectedOptions((prev) =>
      prev.filter((option) => getOptionValue(option) !== valueToRemove)
    );
  };

  return (
    <div ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px]">
        {selectedOptions.map((option, index) => (
          <div
            className="flex items-center justify-between p-1 px-2 bg-gray-200 border rounded-md gap-x-2"
            key={index}
          >
            <div>{getOptionLabel(option)}</div>
            <div
              onClick={() => handleRemoveOption(option)}
              className="cursor-pointer"
            >
              <X size={16} />
            </div>
          </div>
        ))}
         <input
            className="flex-grow w-full bg-transparent focus:outline-none"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            value={searchTerm}
            type="text"
            placeholder={placeholder}
            onFocus={() => setIsOpen(true)}
          />
      </div>
      <div className="relative">
      {isOpen && (
        <div className="max-h-[20vh] border w-full absolute overflow-y-auto bg-white shadow-lg rounded-md mt-1 z-10">
           {isLoading && <div className="px-2 py-1 text-gray-500">Loading...</div>}
           {!isLoading && queryResults && queryResults.map((option, index) => (
            <div
              onClick={() => handleAddOption(option)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              key={index}
            >
              {getOptionLabel(option)}
            </div>
          ))}
        </div>
      )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}

