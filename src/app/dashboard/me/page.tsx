"use client";

import DragAndDropFile from "@/components/createCompany/DragAndDropFile";
import { OptionType } from "@/components/createJob/CreateJobForm";
import SkillsDropdown from "@/components/createJob/SkillsDropdown";
import TextAreaInput from "@/components/createJob/TextAreaInput";
import InputField from "@/components/InputField";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { RootState } from "@/lib/store.config";
import { UpdateProfileSchema } from "@/schema/updateProfile.validator";
import useCreateUserSkill from "@/utils/useCreateUserSkill";
import useDeleteUserSkill from "@/utils/useDeleteUserSkill";
import useGetUser from "@/utils/useGetUser";
import useUpdateUser from "@/utils/useUpdateUser";
import useUploadUserResume from "@/utils/useUploadUserResume";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";

type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;
export default function Page() {
  const [userDirty, setUserDirty] = useState(false);
  const [userProfileDirty, setUserProfileDirty] = useState(false);
  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });

  const dispatch = useDispatch();


  useEffect(()=>{
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
        dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  const { data: userDetails } = useGetUser(jwtToken);
  const { mutate: createUserSkill } = useCreateUserSkill();
  const { mutate: deleteUserSkill } = useDeleteUserSkill();

  const methods = useForm<UpdateProfileType>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNo: "",
      isFresher: false,
      company: null,
      currentCtc: null,
      yearsOfExperience: null,
      resumeUrl: null,
      linkedinUrl: null,
    },
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: zodResolver(UpdateProfileSchema),
  });
  useEffect(() => {
    if (userDetails) {
      methods.reset({
        fullName: userDetails.fullName ?? "",
        email: userDetails.email ?? "",
        phoneNo: userDetails.phoneNo ?? "",
        isFresher: userDetails.profile.isFresher ?? false,
        company: String(userDetails.profile.currentCompanyId) ?? "",
        currentCtc: String(userDetails.profile.currentCtc ?? ""),
        yearsOfExperience: String(userDetails.profile.yearsOfExperience ?? ""),
        resumeUrl: userDetails.profile.resumeUrl ?? null,
        linkedinUrl: userDetails.profile.linkedinUrl ?? null,
        skillIds: userDetails.skills
          ? userDetails.skills.map((skill: OptionType) => skill.id)
          : [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const { mutate: updateUser } = useUpdateUser();

  const onSubmit: SubmitHandler<UpdateProfileType> = async (data) => {
    updateUser({
      userDirty,
      userProfileDirty,
      authJwtToken: jwtToken,
      data,
      id: String(userDetails?.id),
    });
  };
  return (
    <div className="w-full h-full overflow-y-scroll py-6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className=" p-4 ">
          <div className="text-2xl font-bold mb-4">User Details</div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="w-[90%] sm:w-[45%]">
              <div>Full Name</div>
              <InputField
                icon={<></>}
                fieldName="fullName"
                placeholder="Full Name"
                type="text"
                register={register}
                error={errors.fullName}
                fieldValue={userDetails?.fullName}
                onChangeFn={() => {
                  setUserDirty(true);
                }}
              />
            </div>
            <div className="w-[90%] sm:w-[45%]">
              <div>Email</div>
              <InputField
                icon={<></>}
                fieldName="email"
                placeholder="Email"
                type="email"
                register={register}
                error={errors.email}
                fieldValue={userDetails?.email}
                onChangeFn={() => {
                  setUserDirty(true);
                }}
              />
            </div>
            <div className="w-[90%] sm:w-[45%]">
              <div>Phone No</div>
              <InputField
                icon={<></>}
                fieldName="phoneNo"
                placeholder="Phone"
                type="text"
                register={register}
                error={errors.phoneNo}
                fieldValue={userDetails?.phoneNo}
                onChangeFn={() => {
                  setUserDirty(true);
                }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold mb-4">User Profile</div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="w-[90%] sm:w-[45%]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("isFresher")}
                  onChange={() => {
                    setUserProfileDirty(true);
                  }}
                />{" "}
                Fresher
              </label>
            </div>
            <div className="w-[90%] sm:w-[45%]">
              <div>Current CTC</div>
              <InputField
                icon={<></>}
                fieldName="currentCtc"
                placeholder={
                  watch("isFresher") ? "Not necessary" : "Current CTC"
                }
                type="text"
                register={register}
                error={errors.currentCtc}
                fieldValue={userDetails?.profile.currentCtc}
                disabled={watch("isFresher")}
                onChangeFn={() => {
                  setUserProfileDirty(true);
                }}
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
                fieldValue={userDetails?.profile.yearsOfExperience}
                onChangeFn={() => {
                  setUserProfileDirty(true);
                }}
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
                onChangeFn={() => {
                  setUserProfileDirty(true);
                }}
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
                fieldValue={userDetails?.profile.linkedinUrl}
                onChangeFn={() => {
                  setUserProfileDirty(true);
                }}
              />
            </div>
            <div className="w-[90%]">
              <div></div>
              <TextAreaInput
                onChangeFn={() => {
                  setUserProfileDirty(true);
                }}
                icon={<></>}
                fieldName="bio"
                placeholder="Bio"
                register={register}
                error={errors.bio}
                fieldValue={userDetails?.profile.bio}
              />
            </div>
          </div>
          <div className="w-[90%] ">
            <div></div>
            <SkillsDropdown
              error={errors.skillIds}
              fieldName="skillIds"
              jwtToken={jwtToken}
              setValue={setValue}
              fieldValue={userDetails?.skills}
              handleSkillAdd={(id: number) => {
                createUserSkill({ authJwtToken: jwtToken, skillIds: [id] });
              }}
              handleSkillDelete={(id: number) => {
                deleteUserSkill({ authJwtToken: jwtToken, skillId: id });
              }}
            />
          </div>
          <div
            className="w-full mt-4"
            onClick={() => {
            }}
          >
            <button
              className="p-2 border bg-blue-300 rounded-2xl"
              type="submit"
              disabled={false}
            >
              {false ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
