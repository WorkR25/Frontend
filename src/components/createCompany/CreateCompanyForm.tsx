"use client";

import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import {
  CreateCompanySchema,
  CreateCompanyFormData,
} from "@/schema/createCompany.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  ChevronRight,
  CloudUpload,
  Link,
  Link2,
  Users,
  X,
} from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import InputField from "../InputField";
import useCreateCompany from "@/utils/useCreateCompany";
import { useEffect, useState } from "react";
// import MarkdownEditor from "../createJob/MarkdownEditor";
import TripleDotLoader from "../TripleDotLoader";
import Dropdown from "../createJob/Dropdown";
import useGetCompanySize from "@/utils/useGetCompanySize";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { OptionType } from "../createJob/CreateJobForm";
import useGetIndustry from "@/utils/useGetIndustry";
import DragAndDropFileBlob from "./DragAndDropFileBlob";
// import CustomMDEditor from "../createJob/CustomMDEditor";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MarkdownEditor from "../MarkdownEditor";
import NameExistsChecker from "./NameExistsChecker";
import useFindCompanyName from "@/utils/useFindCompanyName";
import Image from "next/image";
import { MdOutlineDescription } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";

export default function CreateCompanyForm() {
  const [companyNameExists, setCompanyNameExists] = useState(true);
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
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const { mutate: createCompany, isSuccess, isPending } = useCreateCompany();
  const { data: companySizeList } = useGetCompanySize(jwtToken);

  const onSubmit = (createData: CreateCompanyFormData) => {
    createCompany({
      authJwtToken: jwtToken,
      createData,
      file: createData.logoImage,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setShowCreateCompanyForm(false));
      reset();
    }
  }, [isSuccess, reset]);

  if (!jwtToken) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/20 backdrop-blur-[10px]">
      <div className="components-createCompany-CreateCompanyForm font-inter relative flex h-full w-full flex-col overflow-hidden bg-white sm:h-[90vh] sm:w-[92%] sm:max-w-[1380px] sm:rounded-[28px] sm:border sm:border-white/70 sm:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        {isPending && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/50">
            <div className="loader"></div>
          </div>
        )}
        <div className="sticky top-0 z-20 shrink-0 border-b-[2.5px] border-gray-200/80 px-8 py-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm ring-1 ring-blue-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 color="#2157C9" size={38} />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-y-1">
                <h1 className="text-3xl font-semibold leading-tight text-gray-900">
                  Create Company
                </h1>
                <p className="text-base leading-snug text-gray-500">
                  Add your company details to get started
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#E7ECF5] bg-white text-[#1F2937] transition hover:bg-[#F8FAFC]"
              onClick={() => dispatch(setShowCreateCompanyForm(false))}
            >
              <X width={22} />
            </button>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            id="create-company-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 overflow-hidden"
          >
            {/* Left side */}
            <div className="create-companyForm-logo-field w-[28%] shrink-0 overflow-y-auto hide-scrollbar pt-5 px-5">
              <div className="rounded-2xl bg-[#f6f7f9] p-5">
                <div className="flex flex-col">
                  <div>
                    <h4 className="text-[1.05rem] font-semibold text-[#111827]">
                      Company Logo
                    </h4>
                    <p className="mt-1 text-[0.92rem] font-medium leading-snug text-[#8A94A6]">
                      Upload a logo to build your brand identity
                    </p>
                  </div>

                  <Controller
                    name="logoImage"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DragAndDropFileBlob
                        file={field.value ?? null}
                        onFileChange={field.onChange}
                        error={fieldState.error}
                      />
                    )}
                  />

                  <div className="mt-4 rounded-[16px] bg-[#EAF3FF] p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1375f2] text-[12px] font-bold text-white">
                        i
                      </div>
                      <h6 className="text-[0.98rem] font-semibold text-[#1375f2]">
                        Logo tips
                      </h6>
                    </div>

                    <ul className="mt-3 space-y-2 pl-5 text-[0.92rem] font-medium text-[#4B5563]">
                      <li className="list-disc">
                        Use a square image (1:1 ratio)
                      </li>
                      <li className="list-disc">Minimum size 200×200 px</li>
                      <li className="list-disc">
                        Transparent background works best
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px shrink-0 bg-gray-200"></div>

            {/* Right side */}
            <div className="create-companyForm-rest-field hide-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-4">
              <div className="rounded-2xl bg-white/40 p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-9">
                  <div>
                    <label className="mb-2 block text-[1rem] font-semibold text-[#111827]">
                      Company Name
                    </label>
                    <NameExistsChecker
                      error={errors.name}
                      companyNameExists={companyNameExists}
                      setCompanyNameExists={setCompanyNameExists}
                      name="name"
                      placeholder="Enter company name"
                      register={register}
                      useQueryFn={useFindCompanyName}
                      watch={watch}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[1rem] font-semibold text-[#111827]">
                      Company Size
                    </label>
                    <Dropdown
                      error={errors.company_size_id}
                      fieldName="company_size_id"
                      getOptionLabel={(option) => {
                        if (option.max_employees > 2000000) {
                          return `${option.min_employees}+ employees`;
                        }
                        return `${option.min_employees}-${option.max_employees} employees`;
                      }}
                      getOptionValue={(option) => option.id}
                      optionArray={companySizeList}
                      placeholder="Select company size"
                      setValue={setValue}
                      resetOn={isSuccess}
                      icon={<Users size={18} />}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[1rem] font-semibold text-[#111827]">
                      Industry
                    </label>
                    <DebouncedDropdown
                      error={errors.industry_id}
                      fieldName="industry_id"
                      getOptionLabel={(option: OptionType) => option.name}
                      getOptionValue={(option: OptionType) => option.id}
                      jwtToken={jwtToken}
                      placeholder="Select an industry"
                      setValue={setValue}
                      useQueryFn={useGetIndustry}
                      useTextValue={false}
                      resetOn={isSuccess}
                      icon={<LiaIndustrySolid size={18} />}
                      inputTerm="industry name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[1rem] font-semibold text-[#111827]">
                      Website
                    </label>
                    <InputField
                      fieldName="website"
                      icon={<Link size={18} />}
                      placeholder="https://company.com"
                      register={register}
                      type="text"
                      error={errors.website}
                    />
                  </div>

                  <div className="col-span-2 mt-5">
                    <div className="mb-3 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FF]">
                        <MdOutlineDescription color="#2B6DEB" size={22} />
                      </div>

                      <div>
                        <h4 className="text-[1.05rem] font-semibold text-[#111827]">
                          Description
                        </h4>
                        <p className="mt-1 text-[0.95rem] font-medium text-[#8A94A6]">
                          Tell us about your company, culture, and what makes it
                          unique
                        </p>
                      </div>
                    </div>

                    <Controller
                      name="description"
                      control={control}
                      render={({ field, fieldState }) => (
                        <MarkdownEditor
                          value={field.value}
                          onValueChange={field.onChange}
                          error={fieldState.error}
                          placeholder="Type or paste your company description..."
                          usingFor="email-editor-company"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>

        <div className="sticky bottom-0 z-20 shrink-0 border-t-[2.5px] border-gray-200/80 px-8 py-5 backdrop-blur-md">
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              className="min-w-[160px] cursor-pointer rounded-full border border-gray-300 bg-white px-8 py-3 text-xl font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
              onClick={() => dispatch(setShowCreateCompanyForm(false))}
            >
              Cancel
            </button>

            <button
              form="create-company-form"
              type="submit"
              // onClick={() => {
              //   setShowDescriptionError(true);
              // }}
              disabled={companyNameExists}
              className={`min-w-[220px] flex items-center gap-x-2 rounded-full px-8 py-3 text-xl font-medium text-white transition ${
                companyNameExists
                  ? "cursor-not-allowed border border-[#9DBDFF] bg-[linear-gradient(90deg,#8FB2FF_0%,#9CC1FF_60%,#86AAFF_100%)] opacity-80 shadow-[0_10px_20px_rgba(46,99,245,0.16)]"
                  : "cursor-pointer border border-[#2D6BFF] bg-[linear-gradient(90deg,#2E63F5_0%,#3478FF_60%,#285BEB_100%)] shadow-[0_12px_24px_rgba(46,99,245,0.28)] hover:brightness-105 active:translate-y-[1px]"
              }`}
            >
              Create Company
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
