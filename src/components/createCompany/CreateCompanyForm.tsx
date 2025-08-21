"use client";

import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { RootState } from "@/lib/store.config";
import { CreateCompanySchema } from "@/schema/createCompany.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Link2, Text, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";
import InputField from "../InputField";
import useCreateCompany from "@/utils/useCreateCompany";
import DragAndDropFile from "./DragAndDropFile";
import useUploadLogo from "@/utils/useUploadLogo";

export type CreateCompanyFormType = z.infer<typeof CreateCompanySchema>;

export default function CreateCompanyForm() {
  const methods = useForm<CreateCompanyFormType>({
    mode: "onChange",      
    reValidateMode: "onBlur",
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logo: "",
    },
  });

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  }= methods ;

  console.log("variable : ", errors);

  const logo = watch("logo");
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);

  const { mutate: createCompany } = useCreateCompany();

  const onSubmit = (createData: CreateCompanyFormType) => {
    console.log("create data", createData);
    createCompany(
      { authJwtToken: jwtToken, createData },
      {
        onSuccess: (data) => {
          console.log("company created:", data);
        },
      }
    );
  };

  return (
    <div className="components-createCompany-CreateCompanyForm justify-center">
      <div
        className="components-createCompany-CreateCompanyForm absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => dispatch(setShowCreateCompanyForm(false))}
      >
        <X width={20} />
      </div>

  <FormProvider
    {...methods}
  >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="components-createCompany-CreateCompanyForm text-gray-400 hide-scrollbar w-full flex flex-col space-y-2 py-4"
      >
        <div>
          <div>Upload company logo</div>

          <DragAndDropFile
          fieldName="logo"
          useMutationFn={useUploadLogo}
          jwtToken={jwtToken}
            fileExtension={[".png"]}
            maxFileSize={3}
          />
        </div>

        <div className="components-createCompany-CreateCompanyForm text-xs">Current logo: {logo}</div>
        <button
          type="button"
          onClick={() => console.log("form values:", getValues())}
        >
          Debug Values
        </button>
        <InputField
          fieldName="name"
          icon={<Building2 />}
          placeholder="Company Name"
          register={register}
          type="text"
          error={errors.name}
        />
        <InputField
          fieldName="description"
          icon={<Text />}
          placeholder="Short Description"
          register={register}
          type="text"
          error={errors.description}
        />
        <InputField
          fieldName="website"
          icon={<Link2 />}
          placeholder="Company Website"
          register={register}
          type="text"
          error={errors.website}
        />
        <button type="submit">Submit</button>
      </form>
      </FormProvider>

    </div>
  );
}
