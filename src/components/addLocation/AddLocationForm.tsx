import { setShowAddLocationForm } from "@/features/showAddLocationForm/showAddLocationFormSlice";
import useCreateLocation from "@/utils/useCreateLocation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, LocateFixed, MapPinned, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { OptionType } from "../createJob/CreateJobForm";
import useGetCity from "@/utils/useGetCity";
import useGetState from "@/utils/useGetState";
import useGetCountry from "@/utils/useGetCountry";
import { AddLocationFormSchema } from "@/schema/addLocation.validator";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import React from "react";

type AddLocationFormType = z.infer<typeof AddLocationFormSchema>;

export default function AddLocationForm() {
  const methods = useForm<AddLocationFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(AddLocationFormSchema),
    defaultValues: {
      city: "",
      state: "",
      country: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const jwtToken = useAppSelector((state) => {
    return state.authJwtToken.value;
  });
  const dispatch = useAppDispatch();
  const { mutate, isPending } = useCreateLocation();
  const onSubmit = (data: AddLocationFormType) => {
    mutate({ jwtToken, ...data });
  };
  return (
    <div className="fixed z-50 w-full h-full font-inter flex items-center justify-center bg-[#0F172A]/20 backdrop-blur-[10px] ">
      <div className="h-full sm:h-auto w-full sm:w-1/2 bg-white sm:rounded-[28px] relative overflow-hidden bg-[radial-gradient(110%_110%_at_50%_10%,rgba(255,255,255,0)_64%,rgba(178,214,244,0.55)_80%,rgba(164,206,241,0.70)_94%,rgba(152,198,236,0.84)_100%)] shadow-2xl">
        {isPending && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
            <div className="loader"></div>
          </div>
        )}

        <FormProvider {...methods}>
          <div className="flex flex-col min-h-0 h-full ">
            <div className="relative z-10 mt-2 py-4 px-2 text-center text-2xl font-semibold ">
              <div
                className="components-createJob-CreateJobForm absolute z-50 top-3 right-5 hover:cursor-pointer "
                onClick={() => {
                  dispatch(setShowAddLocationForm(false));
                }}
              >
                <X width={20} />
              </div>
              <div>Create New Location</div>
              <div className="text-base mt-1 font-normal tracking-wide text-gray-500">
                Fill the fields below to add a new location
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 relative flex-1 flex min-h-0 flex-col "
            >
              <div className=" flex flex-col min-h-0 justify-start sm:justify-center overflow-y-auto">
                <HeadingLabel>City Name</HeadingLabel>
                <DebouncedDropdown
                  error={errors.city}
                  fieldName="city"
                  getOptionLabel={(value: OptionType) => value.name}
                  getOptionValue={(value: OptionType) => value.name}
                  jwtToken={jwtToken}
                  placeholder="City Field"
                  useQueryFn={useGetCity}
                  setValue={setValue}
                  useTextValue={true}
                  icon={<Building2 />}
                />
                <HeadingLabel>State Name</HeadingLabel>

                <DebouncedDropdown
                  error={errors.state}
                  fieldName="state"
                  getOptionLabel={(value: OptionType) => value.name}
                  getOptionValue={(value: OptionType) => value.name}
                  jwtToken={jwtToken}
                  placeholder="State Field"
                  useQueryFn={useGetState}
                  setValue={setValue}
                  useTextValue={true}
                  icon={<MapPinned />}
                />
                <HeadingLabel>Country Name</HeadingLabel>
                <DebouncedDropdown
                  error={errors.country}
                  fieldName="country"
                  getOptionLabel={(value: OptionType) => value.name}
                  getOptionValue={(value: OptionType) => value.name}
                  jwtToken={jwtToken}
                  placeholder="Country Field"
                  useQueryFn={useGetCountry}
                  setValue={setValue}
                  useTextValue={true}
                  icon={<LocateFixed />}
                />
              </div>
              <div className="mt-5 mb-5 sm:mb-20  flex justify-center">
                <button
                  type="submit"
                  className="cursor-pointer tracking-wide w-full sm:w-1/2 py-3 rounded-2xl text-white text-lg border border-[#2D6BFF] bg-[linear-gradient(90deg,#2E63F5_0%,#3478FF_60%,#285BEB_100%)] shadow-[0_12px_24px_rgba(46,99,245,0.28)] hover:brightness-105 active:translate-y-[1px]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}

function HeadingLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-semibold text-lg tracking-tight pl-2 mb-0.5 mt-2.5">
      {children}
    </div>
  );
}
