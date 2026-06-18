"use client";

import { setShowAddTitleForm } from "@/features/showAddTitleForm/showAddTitleFormSlice";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import useCreateJobTitle from "@/utils/useCreateJobTitle";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import NameExistsChecker from "../createCompany/NameExistsChecker";
import useFindJobTitle from "@/utils/useFindJobTitle";
import { useEffect, useState } from "react";

const AddTitleSchema = z.object({
  title: z.string().min(1, "Enter valid title"),
});

type AddTitleType = z.infer<typeof AddTitleSchema>;

export default function AddTitleForm() {
  const [jobTitleExists, setJobTitleExists] = useState(false);

  const dispatch = useAppDispatch();

  const methods = useForm<AddTitleType>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(AddTitleSchema),
    defaultValues: {
      title: "",
    },
  });

  const {
    formState: { errors },
    watch,
    register,
    handleSubmit,
    reset,
  } = methods;

  const jwtToken = useAppSelector((state) => {
    return state.authJwtToken.value;
  });

  const { mutate, isSuccess } = useCreateJobTitle();

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  return (
    <div className="fixed z-50 w-full h-full font-inter flex items-center justify-center bg-[#0F172A]/20 backdrop-blur-[10px] ">
      <div className="flex flex-col w-full sm:w-1/2 h-full sm:h-1/2  bg-white sm:rounded-[28px] relative overflow-hidden bg-[radial-gradient(120%_120%_at_50%_10%,rgba(255,255,255,0)_64%,rgba(178,214,244,0.55)_80%,rgba(164,206,241,0.70)_94%,rgba(152,198,236,0.84)_100%)] shadow-2xl">
        <div className="relative z-10 mt-2 py-4 px-2 text-center text-2xl font-semibold ">
          <div
            className="components-createJob-CreateJobForm absolute z-50 top-3 right-5 hover:cursor-pointer "
            onClick={() => {
              dispatch(setShowAddTitleForm(false));
            }}
          >
            <X width={20} />
          </div>
          <div>Create New Job Title</div>
          <div className="text-base mt-1 font-normal tracking-wide text-gray-500">
            Enter a job title below to create a new listing
          </div>
        </div>
        <div className="w-full  my-5 flex h-full">
          <div className="w-full h-full">
            <FormProvider {...methods}>
              <div className="flex flex-col gap-2 h-full items-center w-full px-3 sm:px-6">
                <div className="flex flex-col sm:justify-center w-full mb-2">
                  <NameExistsChecker<AddTitleType>
                    error={errors.title}
                    name="title"
                    placeholder="Create a new job title"
                    companyNameExists={jobTitleExists}
                    register={register}
                    setCompanyNameExists={setJobTitleExists}
                    useQueryFn={useFindJobTitle}
                    watch={watch}
                    validationFn={(data) => data && data.id}
                    errorMessage="This title already exists"
                  />
                </div>
                <button
                  type="submit"
                  disabled={jobTitleExists}
                  className={`w-full sm:w-1/2 mb-20 text-center flex items-center justify-center gap-x-2 rounded-2xl px-8 py-3 text-xl font-medium text-white transition ${
                    jobTitleExists
                      ? "cursor-not-allowed border border-[#9DBDFF] bg-[linear-gradient(90deg,#8FB2FF_0%,#9CC1FF_60%,#86AAFF_100%)] opacity-80 shadow-[0_10px_20px_rgba(46,99,245,0.16)]"
                      : "cursor-pointer border border-[#2D6BFF] bg-[linear-gradient(90deg,#2E63F5_0%,#3478FF_60%,#285BEB_100%)] shadow-[0_12px_24px_rgba(46,99,245,0.28)] hover:brightness-105 active:translate-y-[1px]"
                  }`}
                  onClick={() => {
                    handleSubmit((data) => {
                      mutate({ authJwtToken: jwtToken, title: data.title });
                    })();
                  }}
                >
                  Create Title
                </button>
              </div>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
