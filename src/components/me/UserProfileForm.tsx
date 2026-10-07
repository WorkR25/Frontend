"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  GraduationCap,
  IndianRupee,
  Layers,
  Linkedin,
} from "lucide-react";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserProfileSchema } from "@/schema/userProfile.validator";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { ctcOptions, domainOptions } from "@/utils/signup.utils";
import useUpdateUserProfile from "@/utils/useUpdateUserProfile";
import ResumeUploader from "./ResumeUploader";
import { Field, ProfileCard, SaveBar, SelectInput, SubHeading, TextInput } from "./profileUi";

export type UserProfileFormValues = z.infer<typeof UserProfileSchema>;

const ICON = "h-[18px] w-[18px]";
const WORKING = "Working Professional";
// Matches the 255-character limit on the profile API.
const BIO_MAX = 255;

const STATUS_OPTIONS = [
  {
    value: "Student",
    title: "Student",
    description: "Studying or recently graduated",
    icon: GraduationCap,
  },
  {
    value: WORKING,
    title: "Working professional",
    description: "Currently employed",
    icon: BriefcaseBusiness,
  },
] as const;

function toValues(user: GetUserResponseType): UserProfileFormValues {
  const p = user.profile;
  return {
    bio: p?.bio ?? "",
    yearsOfExperience: p?.yearsOfExperience ? String(p.yearsOfExperience) : "0",
    details: p?.details ?? "",
    currentCtc: p?.currentCtc || "",
    resumeUrl: p?.resumeUrl ?? "",
    linkedinUrl: p?.linkedinUrl ?? "",
    currentLocation: p?.currentLocation?.name ?? null,
    currentCompany: p?.currentCompany ?? "",
    domain: p?.domain ?? "",
  };
}

export default function UserProfileForm({
  user,
  jwtToken,
}: {
  user: GetUserResponseType;
  jwtToken: string;
}) {
  const uid = useId();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<UserProfileFormValues>({
    mode: "onTouched",
    resolver: zodResolver(UserProfileSchema),
    defaultValues: toValues(user),
  });

  useEffect(() => {
    reset(toValues(user), { keepDirtyValues: true });
  }, [user, reset]);

  const details = watch("details");
  const working = details === WORKING;
  const resumeUrl = watch("resumeUrl");
  const bioLength = (watch("bio") ?? "").length;

  const { mutate, isPending } = useUpdateUserProfile();

  const onSubmit = (values: UserProfileFormValues) => {
    // Students don't have a current job, so clear those fields (they stay in the form if they switch back).
    const payload: UserProfileFormValues = {
      ...values,
      currentCtc: working ? values.currentCtc || null : null,
      currentCompany: working ? values.currentCompany : null,
      yearsOfExperience: working ? values.yearsOfExperience : "0",
      domain: values.domain || null,
    };
    mutate(
      { authJwtToken: jwtToken, id: String(user.id), userProfileData: payload },
      {
        onSuccess: () => {
          reset(values);
          queryClient.invalidateQueries({ queryKey: ["userDetails"] });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ProfileCard
        id="professional"
        icon={<Briefcase className="h-5 w-5" aria-hidden="true" />}
        title="Professional profile"
        description="Helps us match you to the right jobs and referrals."
        footer={
          <SaveBar
            dirty={isDirty}
            pending={isPending}
            onDiscard={() => reset(toValues(user))}
            label="Save profile"
          />
        }
      >
        <SubHeading>CURRENT STATUS</SubHeading>
        <div role="radiogroup" aria-label="Current status" className="grid gap-3 sm:grid-cols-2">
          {STATUS_OPTIONS.map((opt) => {
            const selected = details === opt.value;
            const Icon = opt.icon;
            return (
              <label
                key={opt.value}
                className={cn(
                  "relative flex cursor-pointer items-center gap-3.5 rounded-2xl border-[1.5px] p-4 transition-colors",
                  selected
                    ? "border-[#2451D6] bg-[#F4F7FF] ring-4 ring-[#2451D6]/10"
                    : "border-[#E4E8F0] bg-white hover:border-[#B9CBF3]",
                )}
              >
                <input type="radio" value={opt.value} className="sr-only" {...register("details")} />
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    selected ? "bg-[#2451D6] text-white" : "bg-[#F1F4F9] text-[#5B6478]",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-[#0F172A]">{opt.title}</span>
                  <span className="block text-[13px] text-[#5B6478]">{opt.description}</span>
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px]",
                    selected ? "border-[#2451D6] bg-[#2451D6] text-white" : "border-[#C9D0DC]",
                  )}
                  aria-hidden="true"
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={3.2} />}
                </span>
              </label>
            );
          })}
        </div>
        {errors.details?.message && (
          <p className="ml-1 mt-1.5 text-[13px] font-medium text-[#D92D20]">{errors.details.message}</p>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {working && (
            <>
              <Field
                label="Current company"
                htmlFor={`${uid}-company`}
                error={errors.currentCompany?.message}
                required
              >
                <TextInput
                  id={`${uid}-company`}
                  icon={<Building2 className={ICON} aria-hidden="true" />}
                  placeholder="e.g. Infosys"
                  autoComplete="organization"
                  invalid={!!errors.currentCompany}
                  {...register("currentCompany")}
                />
              </Field>
              <Field
                label="Experience"
                htmlFor={`${uid}-exp`}
                error={errors.yearsOfExperience?.message}
              >
                <TextInput
                  id={`${uid}-exp`}
                  inputMode="numeric"
                  icon={<Clock3 className={ICON} aria-hidden="true" />}
                  placeholder="0"
                  suffix="years"
                  invalid={!!errors.yearsOfExperience}
                  {...register("yearsOfExperience")}
                />
              </Field>
              <Field
                label="Current CTC"
                htmlFor={`${uid}-ctc`}
                error={errors.currentCtc?.message}
                hint="Only used for matching. Never shown to other candidates."
                required
              >
                <SelectInput
                  id={`${uid}-ctc`}
                  icon={<IndianRupee className={ICON} aria-hidden="true" />}
                  placeholder="Select a range"
                  options={ctcOptions}
                  invalid={!!errors.currentCtc}
                  {...register("currentCtc")}
                />
              </Field>
            </>
          )}
          <Field
            label="Domain"
            htmlFor={`${uid}-domain`}
            error={errors.domain?.message}
            hint={working ? undefined : "The field you want to work in."}
          >
            <SelectInput
              id={`${uid}-domain`}
              icon={<Layers className={ICON} aria-hidden="true" />}
              placeholder="Select a domain"
              options={domainOptions}
              {...register("domain")}
            />
          </Field>
        </div>

        <div className="my-6 h-px bg-[#EEF1F6]" />

        <SubHeading>RESUME & LINKS</SubHeading>
        <div className="grid gap-5">
          <Field label="Resume">
            <ResumeUploader
              value={resumeUrl}
              jwtToken={jwtToken}
              unsaved={!!dirtyFields.resumeUrl}
              onUploaded={(url) => setValue("resumeUrl", url, { shouldDirty: true })}
            />
          </Field>
          <Field label="LinkedIn profile" htmlFor={`${uid}-linkedin`} error={errors.linkedinUrl?.message}>
            <TextInput
              id={`${uid}-linkedin`}
              type="url"
              icon={<Linkedin className={ICON} aria-hidden="true" />}
              placeholder="https://linkedin.com/in/your-name"
              invalid={!!errors.linkedinUrl}
              {...register("linkedinUrl")}
            />
          </Field>
        </div>

        <div className="my-6 h-px bg-[#EEF1F6]" />

        <SubHeading>ABOUT YOU</SubHeading>
        <Field
          label="Bio"
          htmlFor={`${uid}-bio`}
          error={errors.bio?.message}
          hint={
            <span className="flex justify-between gap-3">
              <span>A few lines about what you do and what you&apos;re looking for.</span>
              <span className={cn("shrink-0 tabular-nums", bioLength >= BIO_MAX && "text-[#8A4B00]")}>
                {bioLength}/{BIO_MAX}
              </span>
            </span>
          }
        >
          <textarea
            id={`${uid}-bio`}
            rows={4}
            maxLength={BIO_MAX}
            placeholder="e.g. Backend engineer with 3 years of Node.js experience, looking for product roles in Bangalore."
            className="w-full resize-y rounded-[14px] border-[1.5px] border-[#E4E8F0] bg-white px-4 py-3.5 text-[15px] leading-relaxed text-[#0F172A] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2451D6] focus:ring-4 focus:ring-[#2451D6]/10"
            {...register("bio")}
          />
        </Field>
      </ProfileCard>
    </form>
  );
}
