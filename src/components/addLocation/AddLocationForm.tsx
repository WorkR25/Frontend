import { setShowAddLocationForm } from "@/features/showAddLocationForm/showAddLocationFormSlice";
import { RootState } from "@/lib/store.config";
import useCreateLocation from "@/utils/useCreateLocation";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { OptionType } from "../createJob/CreateJobForm";
import useGetCity from "@/utils/useGetCity";
import useGetState from "@/utils/useGetState";
import useGetCountry from "@/utils/useGetCountry";
import { AddLocationFormSchema } from "@/schema/addLocation.validator";



type AddLocationFormType = z.infer<typeof AddLocationFormSchema>;

export default function AddLocationForm() {
  const methods = useForm<AddLocationFormType>({
    mode: "onChange",
    reValidateMode: "onBlur",
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
  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });
  const dispatch = useDispatch();
  const { mutate, isPending } = useCreateLocation();
  const onSubmit = (data: AddLocationFormType) => {
    mutate({ jwtToken, ...data });
  };
  return (
    <div>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="loader"></div>
        </div>
      )}
      <div
        className="components-createJob-CreateJobForm absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(setShowAddLocationForm(false));
        }}
      >
        <X width={20} />
      </div>
      <FormProvider {...methods}>
        <div className="py-4 px-2 text-lg font-semibold">
          Create New Location
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/*<div>
             <div>City</div>
            <div className={"relative w-full"}>
              <input
                {...register("city", {
                  required: true,
                })}
                type={"text"}
                placeholder={"City name"}
                aria-invalid={!!errors.city}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? "border-red-500" : "border-[#E0E0E0]"
                }`}
              />
            </div>
            {errors.city && (
              <p className="text-sm text-red-500 mt-1 ml-1">
                {errors.city.message || "This field is required"}
              </p>
            )}
          </div>
          <div>
            <div className={"relative w-full"}>
              <div>State</div>
              <input
                {...register("state", {
                  required: true,
                })}
                type={"text"}
                placeholder={"State name"}
                aria-invalid={!!errors.city}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? "border-red-500" : "border-[#E0E0E0]"
                }`}
              />
            </div>
            {errors.state && (
              <p className="text-sm text-red-500 mt-1 ml-1">
                {errors.state.message || "This field is required"}
              </p>
            )}
          </div> */}
          {/* <div>
            <div className={"relative w-full"}>
                <div>State</div>
              <input
                {...register("country", {
                  required: true,
                })}
                type={"text"}
                placeholder={"Country name"}
                aria-invalid={!!errors.city}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.country ? "border-red-500" : "border-[#E0E0E0]"
                }`}
              />
              <div></div>
            </div>
            {errors.country && (
              <p className="text-sm text-red-500 mt-1 ml-1">
                {errors.country.message || "This field is required"}
              </p>
            )}
          </div> */}
          <div>City Name</div>

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
          />
          <div>State Name</div>
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
          />
          <div>Country Name</div>
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
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-md bg-blue-200 hover:bg-blue-400 duration-500"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
