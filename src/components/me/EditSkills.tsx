import {
  FieldError,
  FieldValues,
  Merge,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import SkillsDropdown from "../createJob/SkillsDropdown";
import { Skills } from "@/types/JobDetailsType";
import useDeleteUserSkill from "@/utils/useDeleteUserSkill";
import useCreateUserSkill from "@/utils/useCreateUserSkill";
import { useDispatch } from "react-redux";
import { setShowEditSkills } from "@/features/showEditSkils/showEditSkillsSlice";
import { X } from "lucide-react";

export default function EditSkills<TFormValues extends FieldValues>({
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
  handleSkillDelete?: (id: number) => void;
  handleSkillAdd?: (id: number) => void;
}) {

    

  const dispatch = useDispatch();
  const { mutate: createUserSkill } = useCreateUserSkill();
  const { mutate: deleteUserSkill } = useDeleteUserSkill();
  return (
    <div className="py-4 ">
      <div
        className="absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(setShowEditSkills(false));
        }}
      >
        {" "}
        <X width={20} />{" "}
      </div>
      <div className="font-semibold text-lg">Edit Skills</div>
      <div>
        <SkillsDropdown
          error={error}
          fieldName={fieldName}
          jwtToken={jwtToken}
          setValue={setValue}
          fieldValue={fieldValue}
          handleSkillAdd={(id: number, name: string) => {
            createUserSkill({ authJwtToken: jwtToken, skillIds: [id], skillName: name });
          }}
          handleSkillDelete={(id: number) => {
            deleteUserSkill({ authJwtToken: jwtToken, skillId: id });
          }}
        />
      </div>
    </div>
  );
}
