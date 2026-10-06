"use client";

import "katex/dist/katex.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  Briefcase,
  Building2,
  Check,
  IndianRupee,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Type,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import InputField from "../InputField";
import JobCard from "../JobCard";
import MarkdownEditor from "../MarkdownEditor";
import FormModal, {
  FieldLabel,
  FORM_INPUT_CLASS,
  FormSection,
  InternalBadge,
} from "../ui/FormModal";
import DebouncedDropdown from "./DebouncedDropdown";
import Dropdown from "./Dropdown";
import SkillsDropdown from "./SkillsDropdown";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setShowAddLocationForm } from "@/features/showAddLocationForm/showAddLocationFormSlice";
import { setShowAddTitleForm } from "@/features/showAddTitleForm/showAddTitleFormSlice";
import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CreateJobFormData, CreateJobFormSchema } from "@/schema/createJob.validator";
import { cn } from "@/utils/cn";
import useCreateJob from "@/utils/useCreateJob";
import useGetCity from "@/utils/useGetCity";
import useGetCompany from "@/utils/useGetCompany";
import useGetEmploymentType from "@/utils/useGetEmploymentType";
import useGetExperienceLevel from "@/utils/useGetExperienceLevel";
import useGetJobTitle from "@/utils/useGetJobTitle";
import useGetUser from "@/utils/useGetUser";
import useGetUserRoles from "@/utils/useGetUserRoles";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

export type OptionType = {
  id: number;
  name: string;
};

type CompanyOption = OptionType & { logo?: string | null };

const ICON = "h-[18px] w-[18px]";

/** "+ Add new" shortcut shown next to a field label and inside its dropdown. */
function AddNewButton({ label, onClick, block }: { label: string; onClick: () => void; block?: boolean }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-[#2451D6] hover:text-[#1A3FAF]",
        block && "w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-[#F2F5FC]",
      )}
    >
      <Plus className="h-3.5 w-3.5" strokeWidth={2.8} aria-hidden="true" />
      {label}
    </button>
  );
}

export default function CreateJobForm({ className }: { className?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) dispatch(setAuthJwtToken(token));
  }, [dispatch]);

  const { data } = useGetUser(jwtToken);
  const { data: employmentType } = useGetEmploymentType(jwtToken);
  const { data: experienceLevel } = useGetExperienceLevel(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, data?.id);
  const { data: remoteMatches } = useGetCity(jwtToken, "Remote");

  useEffect(() => {
    if (userRoles && !userRoles.includes("admin")) {
      router.replace("/dashboard");
    }
  }, [userRoles, router]);

  const methods = useForm<CreateJobFormData>({
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
    control,
    trigger,
    reset,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const recruiter_id = watch("recruiter_id");
  useEffect(() => {
    if (data?.id && !recruiter_id) setValue("recruiter_id", Number(data.id));
  }, [data?.id, setValue, recruiter_id]);

  // Labels picked in the dropdowns, for the live card preview.
  const [picked, setPicked] = useState<{
    company?: string;
    logo?: string | null;
    title?: string;
    employmentType?: string;
    location?: string;
  }>({});
  const [confirmClose, setConfirmClose] = useState(false);

  // ---- Remote -------------------------------------------------------------
  const remoteLocationId = useMemo(() => {
    const list = Array.isArray(remoteMatches) ? (remoteMatches as OptionType[]) : [];
    return list.find((c) => c.name?.trim().toLowerCase() === "remote")?.id;
  }, [remoteMatches]);
  const isRemote = watch("is_remote");

  const setRemote = (on: boolean) => {
    setValue("is_remote", on, { shouldDirty: true });
    setValue("location_id", on && remoteLocationId ? remoteLocationId : 0, {
      shouldValidate: on,
      shouldDirty: true,
    });
    setPicked((p) => ({ ...p, location: on ? "Remote" : undefined }));
  };

  // ---- Salary unit follows employment type -------------------------------
  const employmentTypeId = watch("employment_type_id");
  const employmentTypeName = (employmentType as OptionType[] | undefined)?.find(
    (t) => t.id === employmentTypeId,
  )?.name;
  const isInternship = employmentTypeName?.toLowerCase().startsWith("intern") ?? false;
  const salaryUnit = isInternship ? "K / month" : "LPA";

  // ---- Submit / close -----------------------------------------------------
  const { mutate, isPending, isSuccess } = useCreateJob();

  const close = useCallback(() => {
    dispatch(toogleShowJobCreateForm());
    reset();
  }, [dispatch, reset]);

  useEffect(() => {
    if (isSuccess) close();
  }, [isSuccess, close]);

  const requestClose = () => {
    if (isPending) return;
    if (isDirty && !confirmClose) setConfirmClose(true);
    else close();
  };

  const onSubmit = (createData: CreateJobFormValues) => {
    mutate({
      createJobData: { ...createData, recruiter_id: Number(data?.id) },
      authJwtToken: jwtToken,
    });
  };

  const onError = () => {
    toast.error("Fill all the required fields to continue");
  };

  // ---- Progress -----------------------------------------------------------
  const values = watch();
  const sections = [
    { label: "Role", done: !!(values.company_id && values.title_id && values.employment_type_id && values.experience_level_id) },
    { label: "Location & apply link", done: !!(values.location_id && values.apply_link) },
    { label: "Pay", done: !!(values.salary_min && values.salary_max) },
    { label: "Skills", done: (values.skillIds?.length ?? 0) > 0 },
    { label: "Description", done: !!values.description?.trim() },
  ];
  const doneCount = sections.filter((s) => s.done).length;

  const openCreateCompany = () => dispatch(setShowCreateCompanyForm(true));
  const openAddTitle = () => dispatch(setShowAddTitleForm(true));
  const openAddLocation = () => dispatch(setShowAddLocationForm(true));

  const footer: ReactNode = confirmClose ? (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-semibold text-[#0F172A]">Discard this job? Your changes will be lost.</span>
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
        <strong className="text-[#0F172A]">{doneCount} of 5</strong> sections complete
      </span>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={requestClose}
          disabled={isPending}
          className="h-[46px] cursor-pointer rounded-xl border border-[#E4E8F0] bg-white px-[18px] text-sm font-bold text-[#344054] hover:bg-[#F4F6FA] disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="create-job-form"
          disabled={isPending}
          className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-[22px] text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#C9D3EE] disabled:shadow-none"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isPending ? "Creating…" : "Create job"}
        </button>
      </div>
    </div>
  );

  return (
    <FormModal
      title="Create a job"
      subtitle="Fill in the details below to post a new job listing."
      icon={<Briefcase className="h-[22px] w-[22px]" aria-hidden="true" />}
      onClose={requestClose}
      closeDisabled={isPending}
      widthClassName={cn("sm:max-w-[1160px]", className)}
      footer={footer}
    >
      <FormProvider {...methods}>
        <form
          id="create-job-form"
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex flex-wrap items-start gap-5"
        >
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
            {/* 1. Role */}
            <FormSection step={1} title="Role" description="Who is hiring, and for what position.">
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                <div>
                  <FieldLabel required action={<AddNewButton label="New company" onClick={openCreateCompany} />}>
                    Company
                  </FieldLabel>
                  <DebouncedDropdown<CreateJobFormValues, CompanyOption>
                    inputClassName={FORM_INPUT_CLASS}
                    plainIcon
                    icon={<Building2 className={ICON} />}
                    placeholder="Search a company"
                    setValue={setValue}
                    fieldName="company_id"
                    error={errors.company_id}
                    jwtToken={jwtToken}
                    useQueryFn={useGetCompany}
                    getOptionLabel={(company) => company.name}
                    getOptionValue={(company) => company.id}
                    onSelectOption={(c) => setPicked((p) => ({ ...p, company: c.name, logo: c.logo }))}
                    inputTerm="a company name"
                    footerAction={<AddNewButton block label="Add a new company" onClick={openCreateCompany} />}
                  />
                </div>

                <div>
                  <FieldLabel required action={<AddNewButton label="New title" onClick={openAddTitle} />}>
                    Job title
                  </FieldLabel>
                  <DebouncedDropdown<CreateJobFormValues, OptionType>
                    inputClassName={FORM_INPUT_CLASS}
                    plainIcon
                    icon={<Type className={ICON} />}
                    placeholder="Search a job title"
                    fieldName="title_id"
                    error={errors.title_id}
                    setValue={setValue}
                    jwtToken={jwtToken}
                    useQueryFn={useGetJobTitle}
                    getOptionLabel={(jobTitle) => jobTitle.name}
                    getOptionValue={(jobTitle) => jobTitle.id}
                    onSelectOption={(t) => setPicked((p) => ({ ...p, title: t.name }))}
                    inputTerm="a job title"
                    footerAction={<AddNewButton block label="Add a new job title" onClick={openAddTitle} />}
                  />
                </div>

                <div>
                  <FieldLabel required>Employment type</FieldLabel>
                  <Dropdown<CreateJobFormValues, OptionType>
                    inputClassName={FORM_INPUT_CLASS}
                    plainIcon
                    icon={<Briefcase className={ICON} />}
                    fieldName="employment_type_id"
                    setValue={setValue}
                    error={errors.employment_type_id}
                    optionArray={employmentType}
                    placeholder="Select employment type"
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    onSelectOption={(o) => setPicked((p) => ({ ...p, employmentType: o.name }))}
                  />
                </div>

                <div>
                  <FieldLabel required>Experience level</FieldLabel>
                  <Dropdown<CreateJobFormValues, OptionType>
                    inputClassName={FORM_INPUT_CLASS}
                    plainIcon
                    icon={<Award className={ICON} />}
                    setValue={setValue}
                    fieldName="experience_level_id"
                    error={errors.experience_level_id}
                    optionArray={experienceLevel}
                    placeholder="Select experience level"
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>
              </div>
            </FormSection>

            {/* 2. Location & apply */}
            <FormSection step={2} title="Location & apply link" description="Where the role is based and where candidates apply.">
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                <div>
                  <FieldLabel
                    required
                    action={!isRemote && <AddNewButton label="New location" onClick={openAddLocation} />}
                  >
                    Location
                  </FieldLabel>
                  {isRemote ? (
                    <div className="flex h-[52px] items-center gap-3 rounded-[14px] border-[1.5px] border-[#CDEBDB] bg-[#F2FBF6] px-4 text-[15px] font-semibold text-[#11643C]">
                      <MapPin className={ICON} aria-hidden="true" />
                      Remote
                    </div>
                  ) : (
                    <DebouncedDropdown<CreateJobFormValues, OptionType>
                      key="location-dropdown"
                      inputClassName={FORM_INPUT_CLASS}
                      plainIcon
                      icon={<MapPin className={ICON} />}
                      placeholder="Search a city"
                      jwtToken={jwtToken}
                      error={errors.location_id}
                      fieldName="location_id"
                      setValue={setValue}
                      useQueryFn={useGetCity}
                      getOptionLabel={(city) => `${city.name}`}
                      getOptionValue={(city) => city.id}
                      onSelectOption={(c) => setPicked((p) => ({ ...p, location: c.name }))}
                      inputTerm="a city"
                      footerAction={<AddNewButton block label="Add a new location" onClick={openAddLocation} />}
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
                  {!remoteLocationId && (
                    <p className="mt-1.5 text-xs text-[#5B6478]">
                      Add a location named “Remote” to enable this switch.
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="apply_link" required>
                    Apply link
                  </FieldLabel>
                  <InputField
                    plainIcon
                    icon={<Link2 className={ICON} />}
                    register={register}
                    fieldName="apply_link"
                    placeholder="https://company.com/careers/job-123"
                    type="url"
                    error={errors.apply_link}
                    inputClassName={FORM_INPUT_CLASS}
                    setValueFn={(v: string) => {
                      const t = (v ?? "").trim();
                      return t && !/^https?:\/\//i.test(t) ? `https://${t}` : t;
                    }}
                  />
                  <p className="mt-2 text-xs text-[#5B6478]">Candidates are sent here when they click Apply.</p>
                </div>
              </div>
            </FormSection>

            {/* 3. Pay */}
            <FormSection
              step={3}
              title="Pay"
              description={isInternship ? "Stipend in thousands per month." : "Annual salary in lakhs (LPA)."}
              badge={<InternalBadge />}
            >
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                {(["salary_min", "salary_max"] as const).map((field) => (
                  <div key={field}>
                    <FieldLabel required>{field === "salary_min" ? "Minimum" : "Maximum"}</FieldLabel>
                    <InputField
                      plainIcon
                      icon={<IndianRupee className={ICON} />}
                      register={register}
                      inputClassName={cn(FORM_INPUT_CLASS, "pr-24")}
                      fieldName={field}
                      placeholder={field === "salary_min" ? (isInternship ? "e.g. 15" : "e.g. 12") : isInternship ? "e.g. 25" : "e.g. 18"}
                      type="number"
                      error={errors[field]}
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

            {/* 4. Skills */}
            <FormSection
              step={4}
              title="Skills"
              description="Used for matching candidates."
              badge={<InternalBadge />}
            >
              <SkillsDropdown
                trigger={trigger}
                setValue={setValue}
                error={errors.skillIds}
                jwtToken={jwtToken}
                fieldName="skillIds"
              />
            </FormSection>

            {/* 5. Description */}
            <FormSection step={5} title="Description" description="Paste the full job description. Headings and bullet points are kept.">
              <div className="overflow-hidden rounded-[14px] [&>div]:rounded-[14px] [&>div]:border-[1.5px] [&>div]:border-[#E4E8F0]">
                <Controller
                  control={control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <MarkdownEditor
                      onValueChange={field.onChange}
                      value={field.value}
                      error={fieldState.error}
                      usingFor="email-editor-job"
                      toolbar="basic"
                      placeholder="Type or paste the job description…"
                    />
                  )}
                />
              </div>
            </FormSection>
          </div>

          {/* Preview + checklist */}
          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 lg:sticky lg:top-0">
            <div className="rounded-[20px] border border-[#E4E8F0] bg-white p-5">
              <div className="mb-3 text-xs font-bold tracking-[0.08em] text-[#5B6478]">HOW CANDIDATES WILL SEE IT</div>
              <div className="pointer-events-none select-none" aria-hidden="true">
                <JobCard
                  id={0}
                  img={picked.logo ?? undefined}
                  title={picked.title || "Job title"}
                  company={picked.company || "Company"}
                  employmentType={picked.employmentType || "Employment type"}
                  city={picked.location || "Location"}
                  country=""
                  minPay=""
                  maxPay=""
                  isRemote={!!isRemote}
                />
              </div>
            </div>

            <div className="rounded-[20px] border border-[#E4E8F0] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.08em] text-[#5B6478]">CHECKLIST</span>
                <span className="text-xs font-bold text-[#0F172A]">{doneCount}/5</span>
              </div>
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#EEF1F6]">
                <div
                  className="h-full rounded-full bg-[#1FA463] transition-[width] duration-300"
                  style={{ width: `${(doneCount / 5) * 100}%` }}
                />
              </div>
              <ul className="flex flex-col gap-2.5">
                {sections.map((s) => (
                  <li key={s.label} className="flex items-center gap-2.5 text-sm font-semibold">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full",
                        s.done ? "bg-[#1FA463] text-white" : "border-[1.5px] border-[#D5DBE6]",
                      )}
                    >
                      {s.done && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
                    </span>
                    <span className={s.done ? "text-[#0F172A]" : "text-[#5B6478]"}>{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </form>
      </FormProvider>
    </FormModal>
  );
}
