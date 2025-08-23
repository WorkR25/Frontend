"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { z } from "zod";
import InputField from "../InputField";
import useGetUser from "@/utils/useGetUser";
import { RootState } from "@/lib/store.config";
import { useEffect } from "react";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useDispatch, useSelector } from "react-redux";
import TextAreaInput from "../createJob/TextAreaInput";
import useUploadUserResume from "@/utils/useUploadUserResume";
import DragAndDropFile from "../createCompany/DragAndDropFile";
import useUpdateUserProfile from "@/utils/useUpdateUserProfile";

export const UserProfileSchema = z.object({
  bio: z.string().nullable().optional(),
  yearsOfExperience: z.number().min(0, "Experience must be non-negative"),
  isFresher: z.boolean(),
  currentCtc: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Enter a valid CTC amount",
  }),
  resumeUrl: z.string().url("Invalid resume URL"),
  linkedinUrl: z.string().url("Invalid LinkedIn URL"),
  currentLocationId: z.number().nullable().optional(),
  currentCompanyId: z.number().nullable().optional(),
  currentLocation: z.string().nullable().optional(),
});

export type UserProfileFormValues = z.infer<typeof UserProfileSchema>;
export default function UserProfileForm() {
  const methods = useForm<UserProfileFormValues>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      bio: "",
      yearsOfExperience: 0,
      isFresher: true,
      currentCtc: "0.00",
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

  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const { data: userData } = useGetUser(jwtToken);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userData?.profile) {
      const profile = userData.profile;
      reset({
        bio: profile.bio ?? "",
        yearsOfExperience: profile.yearsOfExperience ?? 0,
        isFresher: profile.isFresher ?? true,
        currentCtc:
          profile.currentCtc !== null && profile.currentCtc !== undefined
            ? String(profile.currentCtc)
            : "0.00",
        resumeUrl: profile.resumeUrl ?? "",
        linkedinUrl: profile.linkedinUrl ?? "",
        currentLocation: profile.currentLocation ?? null,
      });
    }
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

  const { mutate: updateUserProfile } = useUpdateUserProfile();

  return (
    <FormProvider {...methods}>
        <div className="font-semibold text-lg mt-3">User Profile</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-4 mt-3 border rounded-lg shadow-md w-full"
      >
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="w-[90%]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isFresher")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue("currentCtc", "0");
                    setValue("yearsOfExperience", 0);
                  }
                }}
              />
              Fresher
            </label>
          </div>

          <div className={"w-[90%] sm:w-[45%]"}>
            <div>Current CTC</div>
            <InputField
              className={watch("isFresher") ? "cursor-not-allowed" : ""}
              icon={<></>}
              fieldName="currentCtc"
              placeholder={ "Current CTC"}
              type="text"
              register={register}
              error={errors.currentCtc}
              fieldValue={userData?.profile.currentCtc}
              onChangeFn={() => {}}
            />
          </div>
          <div className="w-[90%] sm:w-[45%]">
            <div>Experience</div>
            <InputField
              icon={<></>}
              fieldName="yearsOfExperience"
              placeholder={
                watch("isFresher") ? "Not necessary" : "Experience in Yrs"
              }
              type="text"
              register={register}
              error={errors.yearsOfExperience}
              disabled={watch("isFresher")}
              fieldValue={userData?.profile.yearsOfExperience}
              onChangeFn={() => {}}
            />
          </div>
          <div className="w-[90%] sm:w-[45%]">
            <div>Resume</div>
            <DragAndDropFile
              fieldName="resumeUrl"
              useMutationFn={useUploadUserResume}
              fileExtension={[".png", ".pdf"]}
              jwtToken={jwtToken}
              maxFileSize={5}
              onChangeFn={() => {}}
            />
            <div className="p-2 border-blue-200 text-xs">
              <a href={watch("resumeUrl")} target="_blank">
                Resume
              </a>
            </div>
          </div>
          <div className="w-[90%] sm:w-[45%]">
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
          <div className="w-[90%]">
            <div></div>
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Profile
        </button>
      </form>
    </FormProvider>
  );
}
