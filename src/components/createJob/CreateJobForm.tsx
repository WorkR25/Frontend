"use client";

import { CreateJobFormSchema } from "@/schema/createJob.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect, useState } from "react";
import useCreateJob from "@/utils/useCreateJob";
import useGetUser from "@/utils/useGetUser";
import { useDispatch } from "react-redux";
import useGetJobTitle from "@/utils/useGetJobTitle";
import useGetCity from "@/utils/useGetCity";
import useGetEmploymentType from "@/utils/useGetEmploymentType";
import useGetExperienceLevel from "@/utils/useGetExperienceLevel";
import useGetCompany from "@/utils/useGetCompany";
import useGetUserRoles from "@/utils/useGetUserRoles";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { Minus, X } from "lucide-react";
import DebouncedDropdown from "./DebouncedDropdown";

import Dropdown from "./Dropdown";
import SkillsDropdown from "./SkillsDropdown";
import { toast, ToastContainer } from "react-toastify";
import MarkdownEditor from "./MarkdownEditor";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

export type OptionType = {
  id: number;
  name: string;
};

export default function CreateJobForm({ className }: { className?: string }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const [jwtToken, setJwtToken] = useState<string | null>("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    setJwtToken(localStorage.getItem("AuthJwtToken"));
  }, []);

  const { data } = useGetUser(jwtToken);
  const { data: employmentType } = useGetEmploymentType(jwtToken);
  const { data: experienceLevel } = useGetExperienceLevel(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, data?.id);

  useEffect(() => {
    if (userRoles && !userRoles?.includes("admin")) {
      router.replace("/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, [userRoles, router]);

  const useFormMethods = useForm<CreateJobFormValues>({
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: zodResolver(CreateJobFormSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useFormMethods;

  const onSubmit = (createData: CreateJobFormValues) => {
    mutate({ createJobData: {...createData, recuiter_id: Number(data?.id)}, authJwtToken: jwtToken });
  };

  const onError = () => {
    toast.error("Fill all the required fields to continue");
  };

  setValue("recuiter_id", Number(data?.id));
  const { mutate, isPending } = useCreateJob();

  if (!isAuthorized || !userRoles || !userRoles.includes("admin")) {
    return <div className="flex justify-center w-full">Authorizing...</div>;
  }

  return (
    <div
      className={cn(
        `components-createJob-CreateJobForm justify-center sm:flex relative `,
        className
      )}
    >
      <ToastContainer position="top-right" autoClose={3000} className="z-20" />
      {/* {!isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 pointer-events-none">
          <div className="loader"></div>
        </div>
      )} */}

      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="loader"></div>
        </div>
      )}

      <div
        className="components-createJob-CreateJobForm absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(toogleShowJobCreateForm());
        }}
      >
        <X width={20} />
      </div>
      <FormProvider {...useFormMethods}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="components-createJob-CreateJobForm text-gray-400 hide-scrollbar w-full justify-center flex flex-col space-y-2 py-4  h-fit"
        >
          <div className="components-createJob-CreateJobForm text-black text-center font-semibold text-xl">
            Create Job
          </div>
          <div className="components-createJob-CreateJobForm sm:flex gap-2">
            <div className="components-createJob-CreateJobForm basis-1/2 ">
              <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
                Company *
              </div>
              {/* <DebouncedDropdown
              placeholder="Select a company"
              setValue={setValue}
              fieldName="company_id"
              error={errors.company_id}
              jwtToken={jwtToken}
              useQueryFn={useGetCompany}
            /> */}

              <DebouncedDropdown<CreateJobFormValues, OptionType>
                placeholder="Select a company"
                setValue={setValue}
                fieldName="company_id"
                error={errors.company_id}
                jwtToken={jwtToken}
                useQueryFn={useGetCompany}
                getOptionLabel={(company) => company.name}
                getOptionValue={(company) => company.id}
              />

              <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
                Job Title *
              </div>
              <DebouncedDropdown<CreateJobFormValues, OptionType>
                placeholder="Select a Job title"
                fieldName="title_id"
                error={errors.title_id}
                setValue={setValue}
                jwtToken={jwtToken}
                useQueryFn={useGetJobTitle}
                getOptionLabel={(jobTitle) => jobTitle.name}
                getOptionValue={(jobTitle) => jobTitle.id}
              />

              <div className="components-createJob-CreateJobForm font-bold text-md  mt-2 text-black">
                Job City *
              </div>
              <DebouncedDropdown<CreateJobFormValues, OptionType>
                placeholder="Select a city"
                jwtToken={jwtToken}
                error={errors.city_id}
                fieldName="city_id"
                setValue={setValue}
                useQueryFn={useGetCity}
                getOptionLabel={(city) => `${city.name}`}
                getOptionValue={(city) => city.id}
              />
            </div>

            <div className="components-createJob-CreateJobForm basis-1/2">
              <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
                Employment Type *
              </div>
              <Dropdown<CreateJobFormValues, OptionType>
                fieldName="employment_type_id"
                setValue={setValue}
                error={errors.employment_type_id}
                optionArray={employmentType}
                placeholder="Select Employment Type"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />

              <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
                Experience *
              </div>
              <Dropdown<CreateJobFormValues, OptionType>
                setValue={setValue}
                fieldName="experience_level_id"
                error={errors.experience_level_id}
                optionArray={experienceLevel}
                placeholder="Select Experience Level"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />

              <div className="components-createJob-CreateJobForm flex h-[42px] items-center mt-[24px]">
                <div className="components-createJob-CreateJobForm font-bold text-md text-center text-black basis-1/3">
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
                />
              </div>
            </div>
          </div>

          <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
            Apply Link*
          </div>
          <InputField
            register={register}
            fieldName="apply_link"
            placeholder={"apply link"}
            type={"text"}
            error={errors.apply_link}
            icon={<></>}
          />

          <div className="components-createJob-CreateJobForm flex justify-center text-center items-center">
            <div className="components-createJob-CreateJobForm ">
              <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
                Minimum Salary *
              </div>
              <InputField
                register={register}
                fieldName="salary_min"
                placeholder={
                  employmentType?.find(
                    (type: OptionType) =>
                      type.id === getValues("employment_type_id")
                  )?.name === "Internship"
                    ? "In thousands"
                    : "In LPA"
                }
                type={"text"}
                error={errors.salary_min}
                icon={<></>}
                setValueFn={(v) => (v === "" ? undefined : Number(v))}
              />
            </div>
            <div>
              <Minus />
            </div>
            <div>
              <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
                Maximum salary *
              </div>
              <InputField
                register={register}
                fieldName="salary_max"
                placeholder={
                  employmentType?.find(
                    (type: OptionType) =>
                      type.id === getValues("employment_type_id")
                  )?.name === "Internship"
                    ? "In thousands "
                    : "In LPA"
                }
                type={"text"}
                error={errors.salary_max}
                icon={<></>}
                setValueFn={(v) => (v === "" ? undefined : Number(v))}
              />
            </div>
          </div>

          <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
            Add Skills *
          </div>
          <SkillsDropdown
            setValue={setValue}
            error={errors.skillIds}
            jwtToken={jwtToken}
            fieldName="skillIds"
          />

          <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
            Job Description{" "}
          </div>
          <MarkdownEditor fieldName={"description"} />

          <button
            type="submit"
            className="components-createJob-CreateJobForm bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
