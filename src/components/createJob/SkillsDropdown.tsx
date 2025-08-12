"use client";

import { useEffect, useState } from "react";
import {
  FieldError,
  FieldValues,
  Merge,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { OptionType } from "./createJobForm";
import { useDebounce } from "@/utils/useDebounce";
import useGetSkill from "@/utils/useGetSkill";
import { ChevronDown, X } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Skills } from "@/types/JobDetailsType";

export default function SkillsDropdown<TFormValues extends FieldValues>({
  fieldName,
  setValue,
  error,
  jwtToken,
  fieldValue,
}: {
  fieldName: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  error: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  jwtToken: string | null;
  fieldValue?: Skills[];
}) {
  console.log("skills: ",fieldValue);
  const [skillIdArray, setSkillIdArray] = useState<number[]>(
    fieldValue
      ? fieldValue.map((v) => {
          return v.id;
        })
      : []
  );
  const [skillNameArray, setSkillNameArray] = useState<
    { id: number; name: string }[]
  >(fieldValue ?? []);
  const [toggle, setToggle] = useState(false);

  useEffect(()=>{
    console.log("id arr", skillIdArray);
    console.log("name arr", skillNameArray)
  },[skillNameArray, skillIdArray])

  const [skills, setSkills] = useState<OptionType[]>([]);
  const [skillName, setSkillName] = useState<string | null>(null);
  const debouncedSkill = useDebounce(skillName, 400);

  const { data: skillData } = useGetSkill(jwtToken, debouncedSkill);

  useEffect(() => {
    if (skillData) {
      setSkills(skillData);
    }
  }, [skillData]);

  const handleSkillSelect = (skill: { id: number; name: string }) => {
    if (skillIdArray.includes(skill.id)) {
      toast.error("This skill is already selected!", {
        position: "top-left",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    setSkillNameArray((prev) => [...prev, skill]);
    setSkillIdArray((prev) => {
      const updated = [...prev, skill.id];
      setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
      return updated;
    });
  };

  const handleRemoveSkill = (id: number) => {
    setSkillIdArray((prev) => {
      const updated = prev.filter((skillId) => skillId !== id);
      setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
      return updated;
    });

    setSkillNameArray((prev) => prev.filter((skill) => skill.id !== id));
  };

  return (
    <div>
      {/* Selected skills */}
      <div className="flex flex-wrap gap-2 my-2 p-2">
        {skillNameArray.map((skill) => (
          <div
            className="flex justify-between p-2 border rounded-lg w-fit gap-x-5"
            key={skill.id}
          >
            <div>{skill.name}</div>
            <div
              onClick={() => handleRemoveSkill(skill.id)}
              className="cursor-pointer"
            >
              <X />
            </div>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      <div>
        <div
          className="flex items-center justify-between w-full pr-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setToggle((prev) => !prev)}
        >
          <input
            className="w-full pl-10 pr-3 py-2"
            onChange={(e) => setSkillName(e.target.value)}
            type="text"
            placeholder="Select a skill"
          />
          <ChevronDown />
        </div>

        {toggle && (
          <div className="h-[20vh] border overflow-y-scroll">
            {skills.map((skill) => (
              <div
                onClick={() => handleSkillSelect(skill)}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                key={skill.id}
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error.message || "This field is required"}
        </p>
      )}

      {/* Toasts */}
      <ToastContainer
        position="top-left"
        autoClose={3000}
        draggable
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
