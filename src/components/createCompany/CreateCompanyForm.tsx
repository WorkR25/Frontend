"use client";

import { Building2, Factory, Link2, Loader2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import CompanyLogo from "../CompanyLogo";
import InputField from "../InputField";
import MarkdownEditor from "../MarkdownEditor";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import Dropdown from "../createJob/Dropdown";
import { OptionType } from "../createJob/CreateJobForm";
import FormModal, { FieldLabel, FORM_INPUT_CLASS, FormSection } from "../ui/FormModal";
import LogoUploader from "./LogoUploader";
import NameExistsChecker from "./NameExistsChecker";
import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CreateCompanyFormData, CreateCompanySchema } from "@/schema/createCompany.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateCompany from "@/utils/useCreateCompany";
import useFindCompanyName from "@/utils/useFindCompanyName";
import useGetCompanySize from "@/utils/useGetCompanySize";
import useGetIndustry from "@/utils/useGetIndustry";

type CompanySize = { id: number; min_employees: number; max_employees: number };

const ICON = "h-[18px] w-[18px]";

function formatCompanySize(option: CompanySize) {
  if (option.max_employees > 2000000) return `${option.min_employees.toLocaleString("en-IN")}+ employees`;
  return `${option.min_employees.toLocaleString("en-IN")}–${option.max_employees.toLocaleString("en-IN")} employees`;
}

export default function CreateCompanyForm() {
  const [companyNameExists, setCompanyNameExists] = useState(true);
  const [picked, setPicked] = useState<{ size?: string; industry?: string }>({});
  const [confirmClose, setConfirmClose] = useState(false);

  const methods = useForm<CreateCompanyFormData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logoImage: undefined,
      company_size_id: undefined,
      industry_id: undefined,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const { mutate: createCompany, isSuccess, isPending } = useCreateCompany();
  const { data: companySizeList } = useGetCompanySize(jwtToken);

  const close = useCallback(() => {
    dispatch(setShowCreateCompanyForm(false));
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

  const onSubmit = (createData: CreateCompanyFormData) => {
    createCompany({ authJwtToken: jwtToken, createData, file: createData.logoImage });
  };

  const name = watch("name") ?? "";
  const logoFile = watch("logoImage");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  if (!jwtToken) return null;

  const footerNote = companyNameExists && name.trim()
    ? "A company with this name already exists"
    : "All fields are required";

  const footer = confirmClose ? (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-semibold text-[#0F172A]">Discard this company? Your changes will be lost.</span>
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
      <span className="text-[13px] text-[#5B6478]">{footerNote}</span>
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
          form="create-company-form"
          type="submit"
          disabled={companyNameExists || isPending}
          className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-[22px] text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#C9D3EE] disabled:shadow-none"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isPending ? "Creating…" : "Create company"}
        </button>
      </div>
    </div>
  );

  return (
    <FormModal
      title="Create a company"
      subtitle="Add a company so you can post jobs for it."
      icon={<Building2 className="h-[22px] w-[22px]" aria-hidden="true" />}
      iconTone="bg-[#E3F6EC] text-[#11643C]"
      onClose={requestClose}
      closeDisabled={isPending}
      widthClassName="sm:max-w-[900px]"
      footer={footer}
    >
      <FormProvider {...methods}>
        <form id="create-company-form" onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <FormSection step={1} title="Basics" description="Name, logo and the essentials.">
            <div className="flex flex-col gap-5">
              <div>
                <FieldLabel required>Logo</FieldLabel>
                <Controller
                  name="logoImage"
                  control={control}
                  render={({ field, fieldState }) => (
                    <LogoUploader
                      file={field.value ?? null}
                      onFileChange={field.onChange}
                      companyName={name}
                      error={fieldState.error}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                <div>
                  <FieldLabel required>Company name</FieldLabel>
                  <NameExistsChecker
                    error={errors.name}
                    companyNameExists={companyNameExists}
                    setCompanyNameExists={setCompanyNameExists}
                    name="name"
                    placeholder="e.g. Cisco"
                    register={register}
                    useQueryFn={useFindCompanyName}
                    watch={watch}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="website" required>
                    Website
                  </FieldLabel>
                  <InputField
                    plainIcon
                    fieldName="website"
                    icon={<Link2 className={ICON} />}
                    placeholder="company.com"
                    register={register}
                    type="text"
                    error={errors.website}
                    inputClassName={FORM_INPUT_CLASS}
                    setValueFn={(v: string) => {
                      const t = (v ?? "").trim();
                      return t && !/^https?:\/\//i.test(t) ? `https://${t}` : t;
                    }}
                  />
                </div>

                <div>
                  <FieldLabel required>Company size</FieldLabel>
                  <Dropdown<CreateCompanyFormData, CompanySize>
                    inputClassName={FORM_INPUT_CLASS}
                    plainIcon
                    icon={<Users className={ICON} />}
                    error={errors.company_size_id}
                    fieldName="company_size_id"
                    getOptionLabel={formatCompanySize}
                    getOptionValue={(option) => option.id}
                    optionArray={companySizeList}
                    placeholder="Select company size"
                    setValue={setValue}
                    resetOn={isSuccess}
                    onSelectOption={(o) => setPicked((p) => ({ ...p, size: formatCompanySize(o) }))}
                  />
                </div>

                <div>
                  <FieldLabel required>Industry</FieldLabel>
                  <DebouncedDropdown<CreateCompanyFormData, OptionType>
                    inputClassName={FORM_INPUT_CLASS}
                    plainIcon
                    icon={<Factory className={ICON} />}
                    error={errors.industry_id}
                    fieldName="industry_id"
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    jwtToken={jwtToken}
                    placeholder="Search an industry"
                    setValue={setValue}
                    useQueryFn={useGetIndustry}
                    useTextValue={false}
                    resetOn={isSuccess}
                    onSelectOption={(o) => setPicked((p) => ({ ...p, industry: o.name }))}
                    inputTerm="an industry"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection
            step={2}
            title="About the company"
            description="Shown on every job page for this company. Culture, product, what makes it unique."
          >
            <div className="overflow-hidden rounded-[14px] [&>div]:rounded-[14px] [&>div]:border-[1.5px] [&>div]:border-[#E4E8F0]">
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <MarkdownEditor
                    value={field.value}
                    onValueChange={field.onChange}
                    error={fieldState.error}
                    placeholder="Type or paste the company description…"
                    usingFor="email-editor-company"
                    toolbar="basic"
                  />
                )}
              />
            </div>
          </FormSection>

          <section className="rounded-[20px] border border-[#E4E8F0] bg-white p-5">
            <div className="mb-3 text-xs font-bold tracking-[0.08em] text-[#5B6478]">HOW IT WILL APPEAR ON JOBS</div>
            <div className="flex items-center gap-3.5">
              <CompanyLogo
                name={name.trim() || "Company"}
                logo={logoPreview}
                className="h-[52px] w-[52px] rounded-2xl border border-[#E4E8F0]"
                textClassName="text-[15px]"
                imagePadding="p-1.5"
              />
              <div className="min-w-0">
                <div className={name.trim() ? "truncate text-[17px] font-extrabold text-[#0F172A]" : "truncate text-[17px] font-extrabold text-[#A3ACBD]"}>
                  {name.trim() || "Company name"}
                </div>
                <div className="truncate text-[13px] text-[#5B6478]">
                  {[picked.industry, picked.size].filter(Boolean).join(" · ") || "Industry · Company size"}
                </div>
              </div>
            </div>
          </section>
        </form>
      </FormProvider>
    </FormModal>
  );
}
