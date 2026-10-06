"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Briefcase, Building2, IndianRupee, Link2, Loader2, MapPin, Pencil, Type } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import InputField from "../InputField";
import MarkdownEditor from "../MarkdownEditor";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import Dropdown from "../createJob/Dropdown";
import { AddNewButton, OptionType } from "../createJob/CreateJobForm";
import SkillsDropdown from "../createJob/SkillsDropdown";
import FormModal, { FieldLabel, FORM_INPUT_CLASS, FormSection, InternalBadge } from "../ui/FormModal";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setShowAddLocationForm } from "@/features/showAddLocationForm/showAddLocationFormSlice";
import { setShowAddTitleForm } from "@/features/showAddTitleForm/showAddTitleFormSlice";
import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { setShowJobupdateForm } from "@/features/showJobUpdateForm/showJobUpdateForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UpdateJobSchema } from "@/schema/updateJob.validator";
import { cn } from "@/utils/cn";
import useGetCity from "@/utils/useGetCity";
import useGetCompany from "@/utils/useGetCompany";
import useGetEmploymentType from "@/utils/useGetEmploymentType";
import useGetExperienceLevel from "@/utils/useGetExperienceLevel";
import useGetJobDetails from "@/utils/useGetJobDetails";
import useGetJobTitle from "@/utils/useGetJobTitle";
import useUpdateJobs from "@/utils/useUpdateJob";

type UpdateFormValues = z.infer<typeof UpdateJobSchema>;

const ICON = "h-[18px] w-[18px]";

export default function UpdateJobForm({ id, className }: { id: number; className?: string }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) dispatch(setAuthJwtToken(token));
  }, [dispatch]);
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const { data: employmentType } = useGetEmploymentType(jwtToken);
  const { data: experienceLevel } = useGetExperienceLevel(jwtToken);
  const { data: remoteMatches } = useGetCity(jwtToken, "Remote");
  const { data: job, isPending: loadingJob, isError } = useGetJobDetails(jwtToken, String(id));
  const { mutate, isPending: saving } = useUpdateJobs();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    resetField,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(UpdateJobSchema),
    defaultValues: { id },
  });

  const [confirmClose, setConfirmClose] = useState(false);
  // The editor re-formats the saved markdown when it loads; only count real edits as changes.
  const descriptionTouched = useRef(false);
  const [loadedId, setLoadedId] = useState<number | null>(null);

  // Prefill once the job has loaded.
  useEffect(() => {
    if (!job || loadedId === id) return;
    reset({
      id,
      apply_link: job.apply_link,
      salary_min: job.salary_min ? Number(job.salary_min) : undefined,
      salary_max: job.salary_max ? Number(job.salary_max) : undefined,
      skillIds: job.skills?.map((s) => s.id) ?? [],
      description: job.description ?? "",
      is_remote: job.city?.name?.trim().toLowerCase() === "remote",
      location_id: job.location_id,
    });
    setLoadedId(id);
  }, [job, id, reset, loadedId]);

  const remoteLocationId = useMemo(() => {
    const list = Array.isArray(remoteMatches) ? (remoteMatches as OptionType[]) : [];
    return list.find((c) => c.name?.trim().toLowerCase() === "remote")?.id;
  }, [remoteMatches]);
  const isRemote = watch("is_remote");

  const setRemote = (on: boolean) => {
    setValue("is_remote", on, { shouldDirty: true });
    setValue("location_id", on && remoteLocationId ? remoteLocationId : undefined, { shouldDirty: true });
  };

  // Salary unit follows employment type (picked or saved).
  const pickedTypeId = watch("employment_type_id");
  const typeName =
    (employmentType as OptionType[] | undefined)?.find((t) => t.id === pickedTypeId)?.name ?? job?.employmentType?.name;
  const isInternship = typeName?.toLowerCase().startsWith("intern") ?? false;
  const salaryUnit = isInternship ? "K / month" : "LPA";

  const close = useCallback(() => dispatch(setShowJobupdateForm(false)), [dispatch]);
  const requestClose = () => {
    if (saving) return;
    if (isDirty && !confirmClose) setConfirmClose(true);
    else close();
  };

  const onSubmit = (values: UpdateFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { is_remote, ...payload } = values;
    mutate({ authJwtToken: jwtToken, updateJobData: { ...payload, skillIds: payload.skillIds ?? [] } }, { onSuccess: close });
  };

  const footer = confirmClose ? (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-semibold text-[#0F172A]">Discard your changes to this job?</span>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => setConfirmClose(false)}
          className="h-[46px] cursor-pointer rounded-xl border border-[#E4E8F0] bg-white px-[18px] text-sm font-bold text-[#344054] hover:bg-[#F4F6FA]"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={close}
          className="h-[46px] cursor-pointer rounded-xl bg-[#D92D20] px-[22px] text-sm font-bold text-white hover:bg-[#B42318]"
        >
          Discard
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-[13px] text-[#5B6478]">
        {isDirty ? (
          <span className="font-semibold text-[#8A4B00]">You have unsaved changes</span>
        ) : (
          "Candidates see your changes as soon as you save."
        )}
      </span>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={requestClose}
          disabled={saving}
          className="h-[46px] cursor-pointer rounded-xl border border-[#E4E8F0] bg-white px-[18px] text-sm font-bold text-[#344054] hover:bg-[#F4F6FA] disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="update-job-form"
          disabled={saving || !job}
          className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-[22px] text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#C9D3EE] disabled:shadow-none"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );

  return (
    <FormModal
      title="Edit job"
      subtitle={job ? `${job.jobTitle.title} · ${job.company.name} · #${id}` : "Loading job details…"}
      icon={<Pencil className="h-[22px] w-[22px]" aria-hidden="true" />}
      onClose={requestClose}
      closeDisabled={saving}
      widthClassName={cn("sm:max-w-[960px]", className)}
      footer={footer}
    >
      {loadingJob || (job && loadedId !== id) ? (
        <div className="flex h-60 items-center justify-center gap-2 text-sm text-[#5B6478]">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Loading job…
        </div>
      ) : isError || !job ? (
        <div className="flex h-60 items-center justify-center text-sm font-semibold text-[#0F172A]">
          This job couldn’t be loaded.
        </div>
      ) : (
        <form id="update-job-form" onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <FormSection step={1} title="Role">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              <div>
                <FieldLabel action={<AddNewButton label="New company" onClick={() => dispatch(setShowCreateCompanyForm(true))} />}>
                  Company
                </FieldLabel>
                <DebouncedDropdown<UpdateFormValues, OptionType>
                  inputClassName={FORM_INPUT_CLASS}
                  plainIcon
                  icon={<Building2 className={ICON} />}
                  placeholder="Search a company"
                  setValue={setValue}
                  fieldName="company_id"
                  error={errors.company_id}
                  jwtToken={jwtToken}
                  useQueryFn={useGetCompany}
                  getOptionLabel={(c) => c.name}
                  getOptionValue={(c) => c.id}
                  fieldValue={job.company.name}
                  inputTerm="a company name"
                />
              </div>
              <div>
                <FieldLabel action={<AddNewButton label="New title" onClick={() => dispatch(setShowAddTitleForm(true))} />}>
                  Job title
                </FieldLabel>
                <DebouncedDropdown<UpdateFormValues, OptionType>
                  inputClassName={FORM_INPUT_CLASS}
                  plainIcon
                  icon={<Type className={ICON} />}
                  placeholder="Search a job title"
                  fieldName="title_id"
                  error={errors.title_id}
                  setValue={setValue}
                  jwtToken={jwtToken}
                  useQueryFn={useGetJobTitle}
                  getOptionLabel={(t) => t.name}
                  getOptionValue={(t) => t.id}
                  fieldValue={job.jobTitle.title}
                  inputTerm="a job title"
                />
              </div>
              <div>
                <FieldLabel>Employment type</FieldLabel>
                <Dropdown<UpdateFormValues, OptionType>
                  inputClassName={FORM_INPUT_CLASS}
                  plainIcon
                  icon={<Briefcase className={ICON} />}
                  fieldName="employment_type_id"
                  setValue={setValue}
                  error={errors.employment_type_id}
                  optionArray={employmentType}
                  placeholder="Select employment type"
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  fieldValue={job.employmentType.name}
                />
              </div>
              <div>
                <FieldLabel>Experience level</FieldLabel>
                <Dropdown<UpdateFormValues, OptionType>
                  inputClassName={FORM_INPUT_CLASS}
                  plainIcon
                  icon={<Award className={ICON} />}
                  setValue={setValue}
                  fieldName="experience_level_id"
                  error={errors.experience_level_id}
                  optionArray={experienceLevel}
                  placeholder="Select experience level"
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  fieldValue={job.experienceLevel.name}
                />
              </div>
            </div>
          </FormSection>

          <FormSection step={2} title="Location & apply link">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              <div>
                <FieldLabel action={!isRemote && <AddNewButton label="New location" onClick={() => dispatch(setShowAddLocationForm(true))} />}>
                  Location
                </FieldLabel>
                {isRemote ? (
                  <div className="flex h-[52px] items-center gap-3 rounded-[14px] border-[1.5px] border-[#CDEBDB] bg-[#F2FBF6] px-4 text-[15px] font-semibold text-[#11643C]">
                    <MapPin className={ICON} aria-hidden="true" />
                    Remote
                  </div>
                ) : (
                  <DebouncedDropdown<UpdateFormValues, OptionType>
                    inputClassName={FORM_INPUT_CLASS}
                    plainIcon
                    icon={<MapPin className={ICON} />}
                    placeholder="Search a city"
                    jwtToken={jwtToken}
                    error={errors.location_id}
                    fieldName="location_id"
                    setValue={setValue}
                    useQueryFn={useGetCity}
                    getOptionLabel={(c) => c.name}
                    getOptionValue={(c) => c.id}
                    fieldValue={job.city?.name?.trim().toLowerCase() === "remote" ? "" : job.city?.name}
                    inputTerm="a city"
                  />
                )}
                <label className="mt-3 flex w-fit cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#344054]">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={!!isRemote}
                    disabled={!remoteLocationId}
                    onChange={(e) => setRemote(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="relative h-6 w-11 rounded-full bg-[#D5DBE6] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-[#1FA463] peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-[#2451D6]/20 peer-disabled:opacity-50"
                  />
                  This is a remote job
                </label>
              </div>
              <div>
                <FieldLabel htmlFor="apply_link">Apply link</FieldLabel>
                <InputField
                  plainIcon
                  icon={<Link2 className={ICON} />}
                  register={register}
                  fieldName="apply_link"
                  placeholder="https://company.com/careers/job-123"
                  type="url"
                  error={errors.apply_link}
                  inputClassName={FORM_INPUT_CLASS}
                  fieldValue={job.apply_link}
                  setValueFn={(v: string) => {
                    const t = (v ?? "").trim();
                    return t && !/^https?:\/\//i.test(t) ? `https://${t}` : t;
                  }}
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            step={3}
            title="Pay"
            description={isInternship ? "Stipend in thousands per month." : "Annual salary in lakhs (LPA)."}
            badge={<InternalBadge />}
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              {(["salary_min", "salary_max"] as const).map((field) => (
                <div key={field}>
                  <FieldLabel>{field === "salary_min" ? "Minimum" : "Maximum"}</FieldLabel>
                  <InputField
                    plainIcon
                    icon={<IndianRupee className={ICON} />}
                    register={register}
                    inputClassName={cn(FORM_INPUT_CLASS, "pr-24")}
                    fieldName={field}
                    placeholder="0"
                    type="number"
                    error={errors[field]}
                    fieldValue={job[field] ? Number(job[field]) : undefined}
                    setValueFn={(v) => (v === "" ? undefined : Number(v))}
                    other={
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5B6478]">
                        {salaryUnit}
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </FormSection>

          <FormSection step={4} title="Skills" badge={<InternalBadge />}>
            <SkillsDropdown
              setValue={setValue}
              error={errors.skillIds}
              jwtToken={jwtToken}
              fieldName="skillIds"
              fieldValue={job.skills}
            />
          </FormSection>

          <FormSection step={5} title="Description">
            <div
              className="overflow-hidden rounded-[14px] [&>div]:rounded-[14px] [&>div]:border-[1.5px] [&>div]:border-[#E4E8F0]"
              onKeyDownCapture={() => (descriptionTouched.current = true)}
              onPasteCapture={() => (descriptionTouched.current = true)}
              onMouseDownCapture={(e) => {
                if ((e.target as HTMLElement).closest("button, [role=toolbar]")) descriptionTouched.current = true;
              }}
            >
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <MarkdownEditor
                    value={field.value}
                    onValueChange={(v) => {
                      if (descriptionTouched.current) field.onChange(v ?? "");
                      else resetField("description", { defaultValue: v ?? "" });
                    }}
                    usingFor="email-editor-job"
                    toolbar="basic"
                    placeholder="Type or paste the job description…"
                  />
                )}
              />
            </div>
          </FormSection>
        </form>
      )}
    </FormModal>
  );
}
