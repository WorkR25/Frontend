"use client";

import { useEffect, useState } from "react";
import {
  FieldError,
  FieldValues,
  Merge,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { OptionType } from "./CreateJobForm";
import { useDebounce } from "@/utils/useDebounce";
import useGetSkill from "@/utils/useGetSkill";
import { ChevronDown, X } from "lucide-react";
import { Skills } from "@/types/JobDetailsType";
import { toast } from "sonner";

export default function SkillsDropdown<TFormValues extends FieldValues>({
  fieldName,
  setValue,
  error,
  jwtToken,
  fieldValue,
  handleSkillDelete,
  handleSkillAdd,
  trigger,
}: {
  fieldName: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  error: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  jwtToken: string | null;
  trigger?: UseFormTrigger<TFormValues>;
  fieldValue?: Skills[];
  handleSkillDelete?: (id: number) => void;
  handleSkillAdd?: (id: number, name: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [skillIdArray, setSkillIdArray] = useState<number[]>(
    fieldValue
      ? fieldValue.map((v) => {
          return v.id;
        })
      : [],
  );
  const [skillNameArray, setSkillNameArray] = useState<
    { id: number; name: string }[]
  >(fieldValue ?? []);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {}, [skillNameArray, skillIdArray]);

  const [skills, setSkills] = useState<OptionType[]>([]);
  const [skillName, setSkillName] = useState<string | null>(null);
  const debouncedSkill = useDebounce(skillName, 400);

  const { data: skillData } = useGetSkill(jwtToken, debouncedSkill);

  useEffect(() => {
    if (skillData) {
      if (!skillName || skillName?.length === 0) {
        setToggle(false);
      } else {
        setToggle(true);
      }
      setSkills(skillData);
    }
  }, [skillData, skillName]);

  // const handleSkillSelect = (skill: { id: number; name: string }) => {
  //   if (skillIdArray.includes(skill.id)) {
  //     toast.error("This skill is already selected!", {
  //       position: "top-left",
  //       autoClose: 3000,
  //       theme: "light",
  //     });
  //     return;
  //   }

  //   setSkillNameArray((prev) => [...prev, skill]);
  //   setSkillIdArray((prev) => {
  //     const updated = [...prev, skill.id];
  //     setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
  //     return updated;
  //   });
  //   handleSkillAdd?.(skill.id)
  // };

  const handleSkillSelect = (skill: { id: number; name: string }) => {
    if (skillIdArray.includes(skill.id)) {
      toast.error("This skill is already selected!");
      return;
    }

    setSkillNameArray((prev) => [...prev, skill]);

    const updated = [...skillIdArray, skill.id];
    setSkillIdArray(updated);
    setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
    trigger?.(fieldName);
    handleSkillAdd?.(skill.id, skill.name);
  };
  // const handleRemoveSkill = (id: number) => {
  //   setSkillIdArray((prev) => {
  //     const updated = prev.filter((skillId) => skillId !== id);
  //     setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
  //     return updated;
  //   });

  //   setSkillNameArray((prev) => prev.filter((skill) => skill.id !== id));
  // };

  const handleRemoveSkill = (id: number) => {
    setSkillIdArray((prev) => prev.filter((skillId) => skillId !== id));
    setSkillNameArray((prev) => prev.filter((skill) => skill.id !== id));
    trigger?.(fieldName);
  };

  useEffect(() => {
    setValue(
      fieldName,
      skillIdArray as PathValue<TFormValues, Path<TFormValues>>,
    );
  }, [skillIdArray, setValue, fieldName]);

  if (!mounted) return null;

  return (
    <div>
      {/* Selected skills */}

      {/* Dropdown */}
      <div>
        <div className="flex min-h-[52px] w-full items-center justify-start rounded-[14px] border-[1.5px] border-[#E4E8F0] bg-white px-2 py-1 transition focus-within:border-[#2451D6] focus-within:ring-4 focus-within:ring-[#2451D6]/10">
          {
            <div className="flex flex-wrap items-center gap-2  w-full">
              {skillNameArray &&
                skillNameArray.length > 0 &&
                skillNameArray.map((skill) => (
                  <div
                    className="m-0.5 flex w-fit items-center gap-x-2 rounded-full bg-[#EAF0FD] py-1 pl-3 pr-2 text-[#1A3FAF]"
                    key={skill.id}
                  >
                    <div className="text-[13px] font-semibold">{skill.name}</div>
                    <div
                      onClick={() => {
                        handleRemoveSkill(skill.id);
                        handleSkillDelete?.(skill.id);
                      }}
                      className="cursor-pointer"
                    >
                      <X size={16} className="hover:text-black" />
                    </div>
                  </div>
                ))}
              <input
                className="h-10 min-w-[200px] flex-1 bg-transparent px-2 text-[15px] font-medium text-[#0F172A] outline-none placeholder:text-[#8A93A6]"
                onChange={(e) => setSkillName(e.target.value)}
                value={skillName ?? ""}
                type="text"
                placeholder="Search and add skills"
              />
            </div>
          }

          <ChevronDown className="hover:cursor-pointer hidden" />
        </div>

        {toggle && (
          <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            {skills.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No skills found
              </div>
            )}

            {skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => {
                  handleSkillSelect(skill);
                  setToggle(false);
                  setSkillName("");
                }}
                className="mx-2 my-1 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
        {/* {toggle && (
          <div
            className={`max-h-[25vh] overflow-y-auto rounded-md ${
              toggle ? "border border-gray-500" : "border border-transparent"
            }`}
          >
            {skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => {
                  handleSkillSelect(skill);
                  setToggle(false);
                  setSkillName("");
                }}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
              >
                {skill.name}
              </div>
            ))}
          </div>
        )} */}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}
