// 'use client' ;

// import { CreateJobFormSchema } from "@/schema/createJob.validator";
// import { useDebounce } from "@/utils/useDebounce";
// import { useEffect, useState } from "react";
// import { FieldError, FieldValues, Path, UseFormSetValue } from "react-hook-form";
// import { OptionType } from "./createJobForm";
// import { ChevronDown } from "lucide-react";
// import z from "zod";

// // type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;


// export default function DebouncedDropdown<T extends FieldValues>({
//   placeholder,
//   jwtToken,
//   fieldName,
//   setValue,
//   error,
//   useQueryFn,
//   fieldValue,
// }: {
//   placeholder: string;
//   jwtToken: string | null;
//   fieldName: Path<T>;
//   setValue: UseFormSetValue<T>;
//   error: FieldError | undefined;
//   fieldValue?: string ;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   useQueryFn: any;
// }) {
//   const [toogle, setToogle] = useState(false);
//   // const [isEmpty, setIsEmpty] = useState<string | null>(null);
//   const [optionArray, setOptionArray] = useState<OptionType[]>();
//   const [partialName, setPartialName] = useState<string>();
//   const [inputValue, setInputValue] = useState(fieldValue || "");
//   const debouncedCity = useDebounce(partialName, 400);

//   const { data } = useQueryFn(jwtToken, debouncedCity);

//   useEffect(() => {
//     if (data) {
//       setOptionArray(data);
//     }
//   }, [debouncedCity, data]);

//   return (
//     <div className="relative ">
//       <div
//         className="flex items-center h-[42px] justify-between pr-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         onClick={() => {
//           setToogle((prev) => {
//             return !prev;
//           });
//         }}
//       >
//         <input
//           className="w-full h-full pl-10 pr-3 py-2"
//           value={inputValue}
//           onChange={(e) => {
//             setInputValue(e.target.value);
//             setPartialName(e.target.value);
//           }}
//           type="text"
//           placeholder={placeholder ? placeholder : ""}
//         ></input>
//         <ChevronDown width={30} />
//       </div>
//       {toogle ? (
//         <div className="h-[20vh] border w-full absolute overflow-y-scroll bg-[#F5F5F5] z-10 ">
//           {optionArray &&
//             optionArray.map((option) => {
//               return (
//                 <div
//                   onClick={() => {
//                     setValue(fieldName, option.id);
//                     // setIsEmpty(option.name);
//                     setInputValue(option.name);
//                     setToogle((prev) => {
//                       return !prev;
//                     });
//                   }}
//                   className="px-2 py-1"
//                   key={option.id}
//                 >
//                   {option.name}
//                 </div>
//               );
//             })}
//         </div>
//       ) : (
//         <></>
//       )}
//       {error && (
//         <p className="text-sm text-red-500 mt-1 ml-1">
//           {error.message || "This field is required"}
//         </p>
//       )}
//     </div>
//   );
// }

'use client';

import { useDebounce } from "@/utils/useDebounce";
import { useEffect, useState, useRef } from "react";
import { FieldError, FieldValues, Path, UseFormSetValue, PathValue } from "react-hook-form";
import { ChevronDown } from "lucide-react";

export interface DebouncedDropdownProps<
  TFormValues extends FieldValues,
  TQueryData
> {
  placeholder: string;
  jwtToken: string | null;
  fieldName: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  error: FieldError | undefined;
  fieldValue?: string;
  useQueryFn: (
    jwtToken: string | null,
    query: string
  ) => {
    data?: TQueryData[];
    isLoading: boolean;
  };
  getOptionLabel: (option: TQueryData) => string;
  getOptionValue: (option: TQueryData) => PathValue<TFormValues, Path<TFormValues>>;
}

export default function DebouncedDropdown<
  TFormValues extends FieldValues,
  TQueryData
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
}: DebouncedDropdownProps<TFormValues, TQueryData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [optionArray, setOptionArray] = useState<TQueryData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState(fieldValue || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQueryFn(jwtToken, debouncedSearchTerm);

  useEffect(() => {
    if (fieldValue) {
      setInputValue(fieldValue);
    }
  }, [fieldValue]);

  useEffect(() => {
    if (data) {
      setOptionArray(data);
    }
  }, [data]);

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

  const handleSelectOption = (option: TQueryData) => {
    const valueToSet = getOptionValue(option);
    const label = getOptionLabel(option);
    setValue(fieldName, valueToSet, { shouldValidate: true, shouldDirty: true });
    setInputValue(label);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center h-[42px] justify-between pr-3 w-full border rounded-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <input
          className="w-full h-full pl-3 pr-3 py-2 bg-transparent focus:outline-none"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSearchTerm(e.target.value);
            if (!isOpen) {
              setIsOpen(true);
            }
          }}
          type="text"
          placeholder={placeholder || ""}
        />
        <ChevronDown
          width={20}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="max-h-[20vh] border w-full absolute overflow-y-auto bg-white shadow-lg rounded-md mt-1 z-10">
          {isLoading && <div className="px-2 py-1 text-gray-500">Loading...</div>}
          {!isLoading && optionArray.length === 0 && (
            <div className="px-2 py-1 text-gray-500">No results found</div>
          )}
          {!isLoading &&
            optionArray.map((option, index) => {
              const label = getOptionLabel(option);
              return (
                <div
                  onClick={() => handleSelectOption(option)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  key={index}
                >
                  {label}
                </div>
              );
            })}
        </div>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">{error.message}</p>
      )}
    </div>
  );
}
