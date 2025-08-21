"use client";

import { UpdateJobSchema } from "@/schema/updateJob.validator";
import useGetJobDetails from "@/utils/useGetJobDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { cn } from "@/utils/cn";
import { useDispatch } from "react-redux";
import { Minus, X } from "lucide-react";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { OptionType } from "../createJob/CreateJobForm";
import useGetCompany from "@/utils/useGetCompany";
import useGetJobTitle from "@/utils/useGetJobTitle";
import useGetCity from "@/utils/useGetCity";
import useGetExperienceLevel from "@/utils/useGetExperienceLevel";
import useGetEmploymentType from "@/utils/useGetEmploymentType";
import useGetUserRoles from "@/utils/useGetUserRoles";
import useGetUser from "@/utils/useGetUser";
import Dropdown from "../createJob/Dropdown";
import InputField from "../InputField";
import SkillsDropdown from "../createJob/SkillsDropdown";
import useUpdateJobs from "@/utils/useUpdateJob";
import { setShowJobupdateForm } from "@/features/showJobUpdateForm/showJobUpdateForm";

type UpdateFormValues = z.infer<typeof UpdateJobSchema>;

export default function UpdateJobForm({
  id,
  className,
}: {
  id: number;
  className?: string;
}) {
  console.log("current job id", id);
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ1c2VyN0BnbWFpbC5jb20iLCJpYXQiOjE3NTQ5MDAzMDgsImV4cCI6MTc1NDk4NjcwOH0.2aVCGufN65l5Ny9QZipZ1hn6mRCMQC1GXRPE52hLvtQ";

  const { data } = useGetUser(jwtToken);
  const { data: employmentType } = useGetEmploymentType(jwtToken);
  const { data: experienceLevel } = useGetExperienceLevel(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, data?.id);
  const { data: jobDetails } = useGetJobDetails(jwtToken, String(id));

  const { mutate } = useUpdateJobs();
  console.log(jobDetails);
  console.log(userRoles);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateFormValues>({
    mode: "onChange",      
    reValidateMode: "onBlur",
    resolver: zodResolver(UpdateJobSchema),
  });

  setValue("id", id);
  const skillIdArray = jobDetails?.skills.map((val)=>{ return val.id})
  setValue('skillIds',skillIdArray);

  function onSubmit(updateData: UpdateFormValues) {
    console.log("updateData", updateData);
    mutate({ authJwtToken: jwtToken, updateJobData: updateData });
  }

  if (!jobDetails) {
    return <div>Loading ... </div>;
  }

  return (
    <div className={cn("justify-center sm:flex ", className)}>
      <div
        className="absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(setShowJobupdateForm(false));
        }}
      >
        {" "}
        <X width={20} />{" "}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-gray-400 hide-scrollbar w-full justify-center flex flex-col space-y-2 py-4  h-fit"
      >
        <div className="text-black text-center font-semibold text-xl">
          Update Job
        </div>
        <div className="sm:flex gap-2">
          <div className="basis-1/2 ">
            <div className="font-bold text-md mt-2 text-black">Company *</div>
            <DebouncedDropdown<UpdateFormValues, OptionType>
              placeholder="Select a company"
              setValue={setValue}
              fieldName="company_id"
              error={errors.company_id}
              jwtToken={jwtToken}
              useQueryFn={useGetCompany}
              getOptionLabel={(company) => company.name}
              getOptionValue={(company) => company.id}
              fieldValue={jobDetails.companyId.name}
            />

            <div className="font-bold text-md mt-2 text-black">Job Title *</div>
            <DebouncedDropdown<UpdateFormValues, OptionType>
              placeholder="Select a Job title"
              fieldName="title_id"
              error={errors.title_id}
              setValue={setValue}
              jwtToken={jwtToken}
              useQueryFn={useGetJobTitle}
              getOptionLabel={(jobTitle) => jobTitle.name}
              getOptionValue={(jobTitle) => jobTitle.id}
              fieldValue={jobDetails.jobTitle.title}
            />

            <div className="font-bold text-md  mt-2 text-black">Job City *</div>
            <DebouncedDropdown<UpdateFormValues, OptionType>
              placeholder="Select a city"
              jwtToken={jwtToken}
              error={errors.city_id}
              fieldName="city_id"
              setValue={setValue}
              useQueryFn={useGetCity}
              getOptionLabel={(city) => `${city.name}`}
              getOptionValue={(city) => city.id}
              fieldValue={jobDetails.city.name}
            />
          </div>

          <div className="basis-1/2">
            <div className="font-bold text-md mt-2 text-black">
              Employment Type *
            </div>
            <Dropdown<UpdateFormValues, OptionType>
              fieldName="employment_type_id"
              setValue={setValue}
              error={errors.employment_type_id}
              optionArray={employmentType}
              placeholder="Select Employment Type"
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              fieldValue={jobDetails.employmentType.name}
            />

            <div className="font-bold text-md mt-2 text-black">
              Experience *
            </div>
            <Dropdown<UpdateFormValues, OptionType>
              setValue={setValue}
              fieldName="experience_level_id"
              error={errors.experience_level_id}
              optionArray={experienceLevel}
              placeholder="Select Experience Level"
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              fieldValue={jobDetails.experienceLevel.name}
            />

            <div className="flex h-[42px] items-center mt-[24px]">
              <div className="font-bold text-md text-center text-black basis-1/3">
                Is Remote *
              </div>
              <InputField
                register={register}
                fieldName="is_remote"
                placeholder={"is remote"}
                type={"checkbox"}
                error={errors.is_remote}
                icon={<></>}
                className="basis-2/3 justify-start outline-none"
                fieldValue={jobDetails.is_remote}
              />
            </div>
          </div>
        </div>

        <div className="font-bold text-md mt-2 text-black">Apply Link*</div>
        <InputField
          register={register}
          fieldName="apply_link"
          placeholder={"apply link"}
          type={"text"}
          error={errors.apply_link}
          icon={<></>}
          fieldValue={jobDetails.apply_link}
        />

        <div className="flex justify-center text-center items-center">
          <div className="">
            <div className="font-bold text-md mt-2 text-black">
              Minimum Salary *
            </div>
            <InputField
              register={register}
              fieldName="salary_min"
              placeholder={"min salary"}
              type={"text"}
              error={errors.salary_min}
              icon={<></>}
              setValueFn={(v) => (v === "" ? undefined : Number(v))}
              fieldValue={jobDetails.salary_min}
            />
          </div>
          <div>
            <Minus />
          </div>
          <div>
            <div className="font-bold text-md mt-2 text-black">
              Maximum salary *
            </div>
            <InputField
              register={register}
              fieldName="salary_max"
              placeholder={"max salary"}
              type={"text"}
              error={errors.salary_max}
              icon={<></>}
              setValueFn={(v) => (v === "" ? undefined : Number(v))}
              fieldValue={jobDetails.salary_max}
            />
          </div>
        </div>
        <div className="font-bold text-md mt-2 text-black">Add Skills *</div>

        <SkillsDropdown
          setValue={setValue}
          error={errors.skillIds}
          jwtToken={jwtToken}
          fieldName="skillIds"
          fieldValue={jobDetails.skills}
        />

        <button
          onClick={() => {
            console.log("object", errors);
          }}
          type="submit"
          className="bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
