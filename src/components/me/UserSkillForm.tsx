"use client";

import useGetUser from "@/utils/useGetUser";
import { RootState } from "@/lib/store.config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import SkillItem from "./SkillItem";
import {
  setShowEditSkills,
  setShowEditSkillsPayload,
} from "@/features/showEditSkils/showEditSkillsSlice";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SkillUpdateSchema = z.object({
  skillIds: z.array(z.number()),
});

export type SkillUpdateFormValue = z.infer<typeof SkillUpdateSchema>;

export default function UserSkillForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    setValue,
    formState: { errors },
  } = useForm<SkillUpdateFormValue>({
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: zodResolver(SkillUpdateSchema),
  });

  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  

  const { data: userData } = useGetUser(jwtToken);
  if (!mounted) return null;
  return (
    <div className=" space-y-4 p-4 my-3 border rounded-lg shadow-md w-full">
      <div className="">
        <div className="flex justify-between items-center p-2">
          <div className="text-lg font-semibold">Skills</div>
          <div
            className="border border-gray-300 p-2 hover:cursor-pointer rounded-lg"
            onClick={() => {
                dispatch(setShowEditSkills(true));
              dispatch(
                setShowEditSkillsPayload({
                  fieldName: "skillIds",
                  setValue: setValue, // from react-hook-form
                  error: errors.skillIds, // specific error object
                  jwtToken: jwtToken, // jwt token from state
                  fieldValue: userData?.skills, // current value of the field
                  value: true, // add required 'value'
                })
              );
            }}
          >
            Edit
          </div>
        </div>
        <div className="overflow-y-scroll h-[30vh] ">
          <div className="">
            {userData && userData.skills && userData.skills.length > 0 ? (
              userData.skills.map((skill, index) => (
                <SkillItem key={index} skillName={skill.name} />
              ))
            ) : (
              <div className="text-gray-500">No skills added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
