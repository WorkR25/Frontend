import { setShowAddSkillsForm } from "@/features/showAddSkillsForm/showAddSkillsFormSlice";
import { RootState } from "@/lib/store.config";
import useCreateSkill from "@/utils/useCreateSkills";
import useGetSkill from "@/utils/useGetSkill";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function AddSkill() {
  const [skills, setSkills] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const dispatch = useDispatch();

  const { mutate, isPending, isSuccess } = useCreateSkill();

  useEffect(() => {
    if (isSuccess) {
      setSkills([]);
    }
  }, [isSuccess]);

  const jwtToken = useSelector((state: RootState) => {
      return state.authJwtToken.value;
    });
    const { data: skillList } = useGetSkill(jwtToken, currentInput) ;

  return (
    <div className="text-black all-[unset] py-3 justify-center h-full">
      <div
        className="components-createJob-CreateJobForm absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(setShowAddSkillsForm(false));
        }}
      >
        <X width={20} />
      </div>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="loader"></div>
        </div>
      )}
      <div className="flex items-center gap-4 my-4">
        <div className="font-semibold text-xl">Add Skills</div>
        <button
          className="py-2 px-4 border rounded"
          onClick={() => {
            mutate({ jwtToken, skills });
          }}
        >
          Save
        </button>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <input
          className={`basis-9/10 pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          value={currentInput}
          onChange={(e) => {
            setCurrentInput(e.target.value);
          }}
        />

        <button
          className="basis-1/10 border rounded hover:cursor-pointer pr-3 py-2"
          onClick={() => {
            if (skills.includes(currentInput)) {
              toast.error("Skill already added");
            } else {
              setSkills((prev) => [...prev, currentInput]);
              setCurrentInput("");
            }
          }}
        >
          +
        </button>
      </div>
      <div className="mt-4 overflow-y-auto min-h-[50%]">
        {skillList && skillList.map((skill, index)=>
            (
                <div className="border mt-1 px-6 py-3 rounded-sm" key={index}>{skill.name}</div>
            )
        ) }
      </div>
      <div className="flex flex-wrap mt-4">
        {skills.map((skill, index) => (
          <div
            className="p-2 flex items-center justify-center gap-2 border rounded-lg"
            key={index}
          >
            <div>{skill}</div>
            <div>
              <X />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
