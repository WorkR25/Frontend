"use client";

import { setShowAddTitleForm } from "@/features/showAddTitleForm/showAddTitleFormSlice";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RootState } from "@/lib/store.config";
import useGetJobTitle from "@/utils/useGetJobTitle";
import useCreateJobTitle from "@/utils/useCreateJobTitle";
import { OptionType } from "../createJob/CreateJobForm";

const AddTitleSchema = z.object({
  title: z.string().min(1, "Enter valid title"),
});

type AddTitleType = z.infer<typeof AddTitleSchema>;

export default function AddTitleForm() {
  const dispatch = useDispatch();

  const methods = useForm<AddTitleType>({
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: zodResolver(AddTitleSchema),
    defaultValues: {
      title: "",
    },
  });

  const {
    formState: { errors },
    setValue,
    handleSubmit,
  } = methods;

  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });

  const { mutate, isSuccess } = useCreateJobTitle();

  return (
    <div className="w-full my-5">
        <div className="text-center font-semibold text-xl">Create Job Title</div>
    <div className="w-full my-5 flex items-center">
      <div
        className="components-createJob-CreateJobForm absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(setShowAddTitleForm(false));
        }}
      >
        <X width={20} />
      </div>
      <div className="w-full">
        <FormProvider {...methods}>
          <div className="flex gap-2 items-center justify-center w-full">
            <DebouncedDropdown<AddTitleType, OptionType>
              error={errors.title}
              fieldName="title"
              getOptionLabel={(title) => title.name}
              getOptionValue={(title) => title.name}
              jwtToken={jwtToken}
              placeholder="Add a new job title"
              setValue={setValue}
              useQueryFn={useGetJobTitle}
              useTextValue={true}
              resetOn={isSuccess}
            />
          <button
            type="submit"
            className="border rounded-lg hover:cursor-pointer"
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
  );
}
