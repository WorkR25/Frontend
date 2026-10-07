"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Mail, Phone, UserRound } from "lucide-react";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserDetailSchema } from "@/schema/userDetails.validator";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import useUpdateUserDetails from "@/utils/useUpdateUserDetails";
import { Field, ProfileCard, SaveBar, TextInput } from "./profileUi";

export type UserDetailFormValues = z.infer<typeof UserDetailSchema>;

const ICON = "h-[18px] w-[18px]";

function toValues(user: GetUserResponseType): UserDetailFormValues {
  return {
    fullName: user.fullName ?? "",
    email: user.email ?? "",
    phoneNo: user.phoneNo ?? "",
    graduationYear: user.graduationYear ? String(user.graduationYear) : "",
  };
}

export default function UserDetailForm({
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
    formState: { errors, isDirty },
  } = useForm<UserDetailFormValues>({
    mode: "onTouched",
    resolver: zodResolver(UserDetailSchema),
    defaultValues: toValues(user),
  });

  // Keep the form in sync when the user record is refetched.
  useEffect(() => {
    reset(toValues(user), { keepDirtyValues: true });
  }, [user, reset]);

  const { mutate, isPending } = useUpdateUserDetails();

  const onSubmit = (values: UserDetailFormValues) => {
    mutate(
      { authJwtToken: jwtToken, id: String(user.id), userDetails: values },
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
        id="personal"
        icon={<UserRound className="h-5 w-5" aria-hidden="true" />}
        title="Personal details"
        description="How recruiters will contact you."
        footer={
          <SaveBar
            dirty={isDirty}
            pending={isPending}
            onDiscard={() => reset(toValues(user))}
            label="Save details"
          />
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor={`${uid}-name`} error={errors.fullName?.message} required>
            <TextInput
              id={`${uid}-name`}
              icon={<UserRound className={ICON} aria-hidden="true" />}
              placeholder="Your full name"
              autoComplete="name"
              invalid={!!errors.fullName}
              {...register("fullName")}
            />
          </Field>
          <Field label="Email" htmlFor={`${uid}-email`} error={errors.email?.message} required>
            <TextInput
              id={`${uid}-email`}
              type="email"
              icon={<Mail className={ICON} aria-hidden="true" />}
              placeholder="you@example.com"
              autoComplete="email"
              invalid={!!errors.email}
              {...register("email")}
            />
          </Field>
          <Field label="Phone number" htmlFor={`${uid}-phone`} error={errors.phoneNo?.message} hint="10-digit mobile number" required>
            <TextInput
              id={`${uid}-phone`}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              icon={<Phone className={ICON} aria-hidden="true" />}
              placeholder="9876543210"
              autoComplete="tel-national"
              invalid={!!errors.phoneNo}
              {...register("phoneNo")}
            />
          </Field>
          <Field label="Graduation year" htmlFor={`${uid}-grad`} error={errors.graduationYear?.message} required>
            <TextInput
              id={`${uid}-grad`}
              inputMode="numeric"
              maxLength={4}
              icon={<GraduationCap className={ICON} aria-hidden="true" />}
              placeholder="e.g. 2024"
              invalid={!!errors.graduationYear}
              {...register("graduationYear")}
            />
          </Field>
        </div>
      </ProfileCard>
    </form>
  );
}
