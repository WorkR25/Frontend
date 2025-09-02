"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { z } from "zod";
import InputField from "../InputField";
import useGetUser from "@/utils/useGetUser";
import { RootState } from "@/lib/store.config";
import { useEffect, useState } from "react";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useDispatch, useSelector } from "react-redux";
import TextAreaInput from "../createJob/TextAreaInput";
import useUploadUserResume from "@/utils/useUploadUserResume";
import DragAndDropFile from "../createCompany/DragAndDropFile";
import useUpdateUserProfile from "@/utils/useUpdateUserProfile";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { OptionType } from "../createJob/CreateJobForm";
import useGetCompany from "@/utils/useGetCompany";
import useGetCompanyById from "@/utils/useGetCompanyById";
import useGetCity from "@/utils/useGetCity";
import { UserProfileSchema } from "@/schema/userProfile.validator";
import { useRouter } from "next/navigation";



export type UserProfileFormValues = z.infer<typeof UserProfileSchema>;
export default function UserProfileForm() {
  const [isFresher, setIsFresher] = useState<boolean>()
  const methods = useForm<UserProfileFormValues>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      bio: "",
      yearsOfExperience: "0",
      isFresher: false,
      currentCtc: "0",
      resumeUrl: "",
      linkedinUrl: "",
      currentLocation: null,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const { data: userData } = useGetUser(jwtToken);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }else{
      router.replace('/login')
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (userData?.profile) {
      const profile = userData.profile;
      reset({
        bio: profile.bio ?? "",
        yearsOfExperience: profile.yearsOfExperience ? String(profile.yearsOfExperience) ?? '0' : '0',
        isFresher: profile.isFresher ?? false,
        currentCtc:
          profile.currentCtc !== null && profile.currentCtc !== undefined
            ? String(profile.currentCtc)
            : "0.00",
        resumeUrl: profile.resumeUrl ?? "",
        linkedinUrl: profile.linkedinUrl ?? "",
        currentLocation: profile.currentLocation?.name ?? null,
        currentCompanyId: profile.currentCompanyId ?? null ,
      });
    }
    setIsFresher(userData?.profile.isFresher == null ? false : userData.profile.isFresher)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onSubmit = (data: UserProfileFormValues) => {
    if (userData?.id) {
      updateUserProfile({
        authJwtToken: jwtToken,
        id: String(userData.id),
        userProfileData: data,
      });
    }
  };
  const { data: companyDetails } = useGetCompanyById(jwtToken,userData?.profile.currentCompanyId)
  const { mutate: updateUserProfile } = useUpdateUserProfile();

  return (
    <FormProvider {...methods}>
      <div className="components-me-UserProfileForm font-semibold text-lg mt-3">User Profile</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="components-me-UserProfileForm space-y-4 p-4 mt-3 border rounded-lg shadow-md w-full"
      >
        <div className="components-me-UserProfileForm flex flex-wrap justify-center gap-4 mt-4">
          <div className="components-me-UserProfileForm w-[90%]">
            <label className="components-me-UserProfileForm flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isFresher")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsFresher(true);
                    setValue("currentCtc", "0");
                    setValue("yearsOfExperience", "0");
                    setValue("currentCompanyId", null);
                  }else{
                    setIsFresher(false);
                  }
                }}
              />
              Fresher
            </label>
          </div>

          <div className={"components-me-UserProfileForm w-[90%] sm:w-[45%]"}>
            <div>Current CTC in LPA</div>
            <InputField
              className={watch("isFresher") ? "cursor-not-allowed" : ""}
              icon={<></>}
              fieldName="currentCtc"
              placeholder={"Current CTC in LPA"}
              type="text"
              register={register}
              error={errors.currentCtc}
              disabled={isFresher}
              fieldValue={watch('currentCtc')}
              onChangeFn={() => {}}
            />
          </div>
          <div className="components-me-UserProfileForm w-[90%] sm:w-[45%]">
            <div>Experience in Yrs</div>
            <InputField
              icon={<></>}
              fieldName="yearsOfExperience"
              placeholder={
                watch("isFresher") ? "Not necessary" : "Experience in Yrs"
              }
              type="text"
              register={register}
              error={errors.yearsOfExperience}
              disabled={isFresher}
              fieldValue={watch('yearsOfExperience') ?? 0}
              onChangeFn={() => {}}
            />
          </div>

          <div className="components-me-UserProfileForm w-[90%] sm:w-[45%]">
            <div>Company</div>
            <DebouncedDropdown<UserProfileFormValues, OptionType>
              placeholder="Select a company"
              fieldName="currentCompanyId"
              error={errors.currentCompanyId}
              setValue={setValue}
              jwtToken={jwtToken}
              useQueryFn={useGetCompany}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.id}
              fieldValue={companyDetails? companyDetails.name :""}
              disabled={isFresher}
            />
          </div>

          <div className="components-me-UserProfileForm w-[90%] sm:w-[45%]">
            <div>Location</div>
            <DebouncedDropdown<UserProfileFormValues, OptionType>
              placeholder="Current Location"
              fieldName='currentLocationId'
              error={errors.currentLocationId}
              setValue={setValue}
              jwtToken={jwtToken}
              useQueryFn={useGetCity}
              getOptionLabel={(value) => value.name}
              getOptionValue={(value) => value.id}
              fieldValue={userData?.profile.currentLocation?.name ?? ""}
            />
          </div>

          <div className="components-me-UserProfileForm w-[90%] sm:w-[45%]">
            <div>Resume</div>
            <DragAndDropFile
              fieldName="resumeUrl"
              useMutationFn={useUploadUserResume}
              fileExtension={[".png", ".pdf"]}
              jwtToken={jwtToken}
              maxFileSize={5}
              onChangeFn={() => {}}
            />
            <div className="p-2 border-blue-300 text-xs">
              <a href={watch("resumeUrl")} target="_blank">
                Resume
              </a>
            </div>
          </div>
          <div className="components-me-UserProfileForm w-[90%] sm:w-[45%]">
            <div>LinkedIn url</div>
            <InputField
              icon={<></>}
              fieldName="linkedinUrl"
              placeholder="LinkedIn Profile"
              type="url"
              register={register}
              error={errors.linkedinUrl}
              fieldValue={userData?.profile.linkedinUrl}
              onChangeFn={() => {}}
            />
          </div>
          <div className="components-me-UserProfileForm w-[90%]">
            <TextAreaInput
              onChangeFn={() => {}}
              icon={<></>}
              fieldName="bio"
              placeholder="Bio"
              register={register}
              error={errors.bio}
              fieldValue={userData?.profile.bio}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="components-me-UserProfileForm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
        >
          Save Profile
        </button>
      </form>
    </FormProvider>
  );
}
