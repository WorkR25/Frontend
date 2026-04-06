"use client";

import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import {
  CreateCompanySchema,
  CreateCompanyFormData,
} from "@/schema/createCompany.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Link2, X } from "lucide-react";
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
import CustomMDEditor from "../createJob/CustomMDEditor";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MarkdownEditor from "../MarkdownEditor";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function CreateCompanyForm() {
  const [showDescriptionError, setShowDescriptionError] = useState(false);

  const methods = useForm<CreateCompanyFormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
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
      if (showDescriptionError) {
        setShowDescriptionError(false);
      }
      reset();
    }
  }, [isSuccess, reset, showDescriptionError]);

  if (!jwtToken) return null;

  return (
    <div className="components-createCompany-CreateCompanyForm text-black all-[unset] justify-center bg-white  h-full">
      <div className="flex justify-between items-start relative">
        <div className="w-full h-[2px] absolute bottom-0 left-0 bg-gray-200"></div>
        <div className="flex">
          <div>
            <Image
              src="/create-company-header-logo.svg"
              className="mt-1"
              alt="Logo"
              width={90}
              height={90}
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mt-4">Create Company</h2>
            <p className="text-sm text-gray-500">
              Add your company details to get started
            </p>
          </div>
        </div>

        <button
          className="mt-4 mr-5"
          onClick={() => dispatch(setShowCreateCompanyForm(false))}
        >
          <X size={25} />
        </button>
      </div>

      {isPending && <TripleDotLoader />}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" components-createCompany-CreateCompanyForm text-black hide-scrollbar w-full flex flex-col space-y-2 h-full overflow-auto"
        >
          <div className=" mb-0 px-5 grid grid-cols-1 lg:grid-cols-[32%_63%]  gap-6 relatives scroll-auto">
            <div className="w-full h-[2px] absolute bottom-0 left-0 bg-gray-200"></div>
            <div className="col-span-1 bg-[#f6f7f9] px-7  py-4 rounded-lg mt-2 overflow-scroll mb-2">
              <h5 className="font-medium text-xl">Company Logo</h5>
              <p className="text-gray-400 font-medium mb-4">
                Upload a logo to build your brand identity
              </p>

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
            </div>

            <div className="relative overflow-auto">
              <div className="w-[2px] h-full absolute left-0 top-0 bg-gray-200"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-5 gap-x-4 mb-3 ml-8 mt-3">
                <div>
                  <h5 className="text-lg font-medium mb-2">Company Name</h5>
                  <InputField
                    fieldName="name"
                    icon={<Building2 />}
                    placeholder="Company Name"
                    register={register}
                    type="text"
                    error={errors.name}
                  />
                </div>

                <div>
                  <h5 className="text-lg font-medium mb-2">Company Size</h5>
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
                  />
                </div>

                <div>
                  <h5 className="text-lg font-medium mb-2">Industry</h5>
                  <DebouncedDropdown
                    error={errors.industry_id}
                    fieldName="industry_id"
                    getOptionLabel={(option: OptionType) => option.name}
                    getOptionValue={(option: OptionType) => option.id}
                    jwtToken={jwtToken}
                    placeholder="Please select an industry"
                    setValue={setValue}
                    useQueryFn={useGetIndustry}
                    useTextValue={false}
                    resetOn={isSuccess}
                  />
                </div>

                <div>
                  <h5 className="text-lg font-medium mb-2">Website</h5>
                  <InputField
                    fieldName="website"
                    icon={<Link2 />}
                    placeholder="Company Website"
                    register={register}
                    type="text"
                    error={errors.website}
                  />
                </div>
              </div>

              <div className="ml-8">
                <h5 className="text-lg font-medium">Description</h5>
                <p className="text-gray-400 text-md  mb-3">
                  Tell us about your company, culture, and what makes it unique
                </p>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <MarkdownEditor
                      value={field.value}
                      onValueChange={field.onChange}
                      error={fieldState.error}
                      placeholder="Type or paste your company description..."
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center my-auto justify-end gap-3 py-4 px-4 absolute bottom-0 right-0 w-full bg-white">
            {/* <div className="absolute bottom-0 left-0 w-full"> */}
            <button
              type="button"
              onClick={() => dispatch(setShowCreateCompanyForm(false))}
              className="px-6 py-2 mt-2 rounded-4xl border cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 cursor-pointer flex py-2 mt-2 bg-[linear-gradient(90deg,#2589E7_0%,#2573E1_50%,#1E5EDF_100%)] text-white rounded-4xl hover:bg-blue-700"
            >
              <h4 className="mr-2 font-semibold"> Create Company</h4>
              <ChevronRight className="h-5 w-5 mt-1 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
          {/* </div> */}
        </form>
      </FormProvider>
    </div>
  );
}
