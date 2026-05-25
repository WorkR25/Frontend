"use client";

import "katex/dist/katex.min.css";
import {
  CreateJobFormSchema,
  CreateJobFormData,
} from "@/schema/createJob.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect } from "react";
import useCreateJob from "@/utils/useCreateJob";
import useGetUser from "@/utils/useGetUser";
import useGetJobTitle from "@/utils/useGetJobTitle";
import useGetCity from "@/utils/useGetCity";
import useGetEmploymentType from "@/utils/useGetEmploymentType";
import useGetExperienceLevel from "@/utils/useGetExperienceLevel";
import useGetCompany from "@/utils/useGetCompany";
import useGetUserRoles from "@/utils/useGetUserRoles";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import {
  BriefcaseBusiness,
  ChevronRight,
  IndianRupee,
  Search,
  X,
} from "lucide-react";
import DebouncedDropdown from "./DebouncedDropdown";
import Dropdown from "./Dropdown";
import SkillsDropdown from "./SkillsDropdown";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MarkdownEditor from "../MarkdownEditor";
import Image from "next/image";
import { toast } from "sonner";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

export type OptionType = {
  id: number;
  name: string;
};

function SectionLabel({
  icon,
  title,
}: {
  icon?: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-[#161B26]">
      {icon}
      <span>{title}</span>
    </div>
  );
}

export default function CreateJobForm({ className }: { className?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  const { data } = useGetUser(jwtToken);
  const { data: employmentType } = useGetEmploymentType(jwtToken);
  const { data: experienceLevel } = useGetExperienceLevel(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, data?.id);

  useEffect(() => {
    if (userRoles && !userRoles.includes("admin")) {
      router.replace("/dashboard");
    }
  }, [userRoles, router]);

  const useFormMethods = useForm<CreateJobFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(CreateJobFormSchema),
    defaultValues: {
      title_id: 0,
      employment_type_id: 0,
      experience_level_id: 0,
      company_id: 0,
      location_id: 0,
      is_remote: false,
      apply_link: "",
      salary_min: undefined,
      salary_max: undefined,
      skillIds: [],
      recruiter_id: data?.id || 0,
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useFormMethods;

  const recruiter_id = watch("recruiter_id");

  useEffect(() => {
    if (data?.id && !recruiter_id) {
      setValue("recruiter_id", Number(data.id));
    }
  }, [data?.id, setValue, recruiter_id]);

  const { mutate, isPending, isSuccess } = useCreateJob();

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  const onSubmit = (createData: CreateJobFormValues) => {
    mutate({
      createJobData: {
        ...createData,
        recruiter_id: Number(data?.id),
      },
      authJwtToken: jwtToken,
    });
  };

  const onError = () => {
    toast.error("Fill all the required fields to continue");
  };

  const handleClose = () => {
    dispatch(toogleShowJobCreateForm());
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/20 backdrop-blur-[10px]">
      <div
        className={cn(
          "font-inter relative flex h-full w-full flex-col overflow-hidden bg-white sm:h-[90vh] sm:w-[92%] sm:max-w-[1380px] sm:rounded-[28px] sm:border sm:border-white/70 sm:shadow-[0_24px_80px_rgba(15,23,42,0.18)]",
          className,
        )}
      >
        {/* <ToastContainer
          position="top-right"
          autoClose={3000}
          className="z-20"
        /> */}

        {isPending && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/50">
            <div className="loader"></div>
          </div>
        )}

        {/* Header */}
        <div className="z-10 grid w-full shrink-0 grid-cols-[1fr_auto] items-center border-b border-[#E8ECF4] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#D9E4FF] bg-[linear-gradient(180deg,#EEF4FF_0%,#DDE9FF_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_rgba(37,99,235,0.12)]">
              <Image
                alt=""
                src="/create-job-header-icon.svg"
                height={1000}
                width={1000}
                className="h-9 w-9"
              />
            </div>

            <div className="text-start">
              <div className="text-3xl font-plus-jakarta font-bold tracking-[-0.02em] text-[#121826] sm:text-[22px]">
                Create Job
              </div>
              <div className="mt-1 text-[14px] font-medium text-[#7A8699]">
                Fill out the details below to post a new job listing
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex h-11 cursor-pointer w-11 items-center justify-center rounded-full border border-[#E7ECF5] bg-white text-[#1F2937] transition hover:bg-[#F8FAFC]"
            onClick={handleClose}
          >
            <X width={22} />
          </button>
        </div>

        <FormProvider {...useFormMethods}>
          <div className="w-full flex-1 min-h-0 bg-[linear-gradient(180deg,#F9FBFF_0%,#F4F7FC_100%)]">
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="flex h-full min-h-0 w-full flex-col text-gray-400"
            >
              {/* Scrollable Body */}
              <div className="hide-scrollbar flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                <div className="rounded-[24px] border border-[#E6EBF4] bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur sm:p-5">
                  <div className="grid w-full grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                      <SectionLabel title="Company *" />
                      <DebouncedDropdown<CreateJobFormValues, OptionType>
                        inputClassName="h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] text-black placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        iconUrl="/company-icon.svg"
                        placeholder="Select a company"
                        setValue={setValue}
                        fieldName="company_id"
                        error={errors.company_id}
                        jwtToken={jwtToken}
                        useQueryFn={useGetCompany}
                        getOptionLabel={(company) => company.name}
                        getOptionValue={(company) => company.id}
                        inputTerm="company name"
                      />
                    </div>

                    <div>
                      <SectionLabel title="Employment Type *" />
                      <Dropdown<CreateJobFormValues, OptionType>
                        inputClassName="h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] text-black placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        iconUrl="/employment-type-icon.svg"
                        fieldName="employment_type_id"
                        setValue={setValue}
                        error={errors.employment_type_id}
                        optionArray={employmentType}
                        placeholder="Select Employment Type"
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                      />
                    </div>

                    <div>
                      <SectionLabel title="Job Title *" />
                      <DebouncedDropdown<CreateJobFormValues, OptionType>
                        inputClassName="h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] text-black placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        iconUrl="/job-title-icon.svg"
                        placeholder="Select a job title"
                        fieldName="title_id"
                        error={errors.title_id}
                        setValue={setValue}
                        jwtToken={jwtToken}
                        useQueryFn={useGetJobTitle}
                        getOptionLabel={(jobTitle) => jobTitle.name}
                        getOptionValue={(jobTitle) => jobTitle.id}
                        inputTerm="job title"
                      />
                    </div>

                    <div>
                      <SectionLabel title="Experience *" />
                      <Dropdown<CreateJobFormValues, OptionType>
                        inputClassName="h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        iconUrl="/experience-icon.svg"
                        setValue={setValue}
                        fieldName="experience_level_id"
                        error={errors.experience_level_id}
                        optionArray={experienceLevel}
                        placeholder="Select Experience Level"
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                      />
                    </div>

                    <div>
                      <SectionLabel title="Job Location *" />
                      <DebouncedDropdown<CreateJobFormValues, OptionType>
                        inputClassName="h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        iconUrl="/job-location-icon.svg"
                        placeholder="Select a location"
                        jwtToken={jwtToken}
                        error={errors.location_id}
                        fieldName="location_id"
                        setValue={setValue}
                        useQueryFn={useGetCity}
                        getOptionLabel={(city) => `${city.name}`}
                        getOptionValue={(city) => city.id}
                        inputTerm="location"
                      />
                    </div>

                    <div>
                      <SectionLabel title="Apply Link *" />
                      <InputField
                        iconUrl="/apply-link-icon.svg"
                        register={register}
                        fieldName="apply_link"
                        placeholder="https://company.com/job123"
                        type="text"
                        error={errors.apply_link}
                        inputClassName=" h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] text-black placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                      />
                    </div>

                    <div>
                      <SectionLabel
                        title="Minimum Salary *"
                        // icon={<Sparkles size={17} className="text-[#316CFF]" />}
                      />
                      <InputField
                        register={register}
                        inputClassName="h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] text-black placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        fieldName="salary_min"
                        placeholder={
                          employmentType?.find(
                            (type: OptionType) =>
                              type.id === getValues("employment_type_id"),
                          )?.name === "Internship"
                            ? "In thousands"
                            : "In LPA"
                        }
                        type="text"
                        error={errors.salary_min}
                        icon={
                          <IndianRupee className="border-r border-[#D8E0EE] pr-1 text-[#5F6C85]" />
                        }
                        setValueFn={(v) => (v === "" ? undefined : Number(v))}
                      />
                    </div>

                    <div>
                      <SectionLabel title="Maximum Salary *" />
                      <InputField
                        inputClassName="h-[54px] rounded-2xl border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] text-black placeholder:text-[#7C8599] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        register={register}
                        fieldName="salary_max"
                        placeholder={
                          employmentType?.find(
                            (type: OptionType) =>
                              type.id === getValues("employment_type_id"),
                          )?.name === "Internship"
                            ? "In thousands"
                            : "In LPA"
                        }
                        type="text"
                        error={errors.salary_max}
                        icon={
                          <IndianRupee className="border-r border-[#D8E0EE] pr-1 text-[#5F6C85]" />
                        }
                        setValueFn={(v) => (v === "" ? undefined : Number(v))}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <SectionLabel
                      title="Add Skills *"
                      icon={<Search size={17} className="text-[#316CFF]" />}
                    />
                    <SkillsDropdown
                      trigger={trigger}
                      setValue={setValue}
                      error={errors.skillIds}
                      jwtToken={jwtToken}
                      fieldName="skillIds"
                    />
                  </div>

                  <div className="mt-5">
                    <SectionLabel
                      title="Job Description *"
                      icon={
                        <BriefcaseBusiness
                          size={17}
                          className="text-[#316CFF]"
                        />
                      }
                    />
                    <div className="overflow-hidden rounded-[20px] border border-[#D8E0EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFD_100%)] shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                      <Controller
                        control={control}
                        name="description"
                        render={({ field, fieldState }) => (
                          <MarkdownEditor
                            onValueChange={field.onChange}
                            value={field.value}
                            error={fieldState.error}
                            usingFor="email-editor-job"
                            placeholder="Type or paste your job description..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="w-full shrink-0 border-t border-[#E8ECF4] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F9FD_100%)] px-4 py-4 sm:px-6">
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full cursor-pointer border border-[#CBD5E1] bg-white px-6 py-3 font-medium text-[#475569] shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition hover:bg-[#F8FAFC]"
                  >
                    Cancel
                  </button>

                  <button
                    className="flex items-center cursor-pointer gap-x-2 rounded-full border border-[#2D6BFF] bg-[linear-gradient(90deg,#2E63F5_0%,#3478FF_60%,#285BEB_100%)] px-7 py-3 font-medium text-white shadow-[0_12px_24px_rgba(46,99,245,0.28)] transition hover:brightness-105"
                    type="submit"
                  >
                    <div>Create Job</div>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
