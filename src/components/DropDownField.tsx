"use client";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";

type FormValues = z.infer<typeof SignUpFormSchema>;

interface OptionProps {
  name: keyof FormValues;
  options: string[];
  defaultValue: string;
}

const DropDownField: FC<OptionProps> = ({
  name,
  options,
  defaultValue,
}) => {
  const {
    register,
    formState: { },
  } = useFormContext();

  return (
    <div className="w-full">
      <select
        {...register(name, { required: "This field is required" })}
        defaultValue=""
        className="select bg-white w-full border-[1px] border-black cursor-pointer"
      >
        
        <option value="" disabled={true}>{defaultValue}</option>
        {options.map((option) => (
            <option className="hover:bg-[#e7e3e4] hover:rounded-md" value={option} key={option}>{option}</option>
        ))}
      </select>

      
    </div>
  );
};

export default DropDownField;
