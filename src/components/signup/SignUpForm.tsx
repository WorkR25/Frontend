"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Building2,
  Check,
  GraduationCap,
  IndianRupee,
  Layers,
  Loader2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput, { PasswordRules } from "@/components/auth/PasswordInput";
import { Field, SelectInput, TextInput } from "@/components/me/profileUi";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import { cn } from "@/utils/cn";
import { safeReturnUrl } from "@/utils/safeReturnUrl";
import { ctcOptions, domainOptions } from "@/utils/signup.utils";
import useSignup from "@/utils/useSignup";

type FormValues = z.infer<typeof SignUpFormSchema>;

const ICON = "h-[18px] w-[18px]";
const WORKING = "Working Professional";

const STATUS_OPTIONS = [
  { value: "Student", title: "Student", hint: "Studying or recently graduated", icon: GraduationCap },
  { value: WORKING, title: "Working professional", hint: "Currently employed", icon: BriefcaseBusiness },
] as const;

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const rawReturnUrl = searchParams.get("returnUrl");
  const loginHref = rawReturnUrl ? `/login?returnUrl=${encodeURIComponent(rawReturnUrl)}` : "/login";

  return (
    <AuthShell
      title="Create your account"
      subtitle="Takes a minute. We use this to match you with the right jobs."
      switchText="Already have an account?"
      switchLabel="Log in"
      switchHref={loginHref}
      wide
    >
      <Form returnUrl={safeReturnUrl(rawReturnUrl)} />
    </AuthShell>
  );
}

function Form({ returnUrl }: { returnUrl: string }) {
  const uid = useId();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      fullName: "",
      phoneNo: "",
      email: "",
      graduationYear: "",
      details: "",
      domain: "",
      currentCompany: "",
      currentCtc: "",
      password: "",
      confirmPassword: "",
    },
  });

  const details = watch("details");
  const working = details === WORKING;
  const password = watch("password") ?? "";

  const { mutate, isPending, isSuccess } = useSignup();
  const busy = isPending || isSuccess;

  const onSubmit = (values: FormValues) => {
    // Company and CTC only apply to working professionals.
    const payload: FormValues = working
      ? values
      : { ...values, currentCompany: undefined, currentCtc: undefined };
    mutate(payload, { onSuccess: () => router.push(returnUrl) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor={`${uid}-name`} error={errors.fullName?.message}>
          <TextInput
            id={`${uid}-name`}
            autoComplete="name"
            icon={<UserRound className={ICON} aria-hidden="true" />}
            placeholder="Your full name"
            invalid={!!errors.fullName}
            {...register("fullName")}
          />
        </Field>
        <Field label="Phone number" htmlFor={`${uid}-phone`} error={errors.phoneNo?.message}>
          <TextInput
            id={`${uid}-phone`}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            icon={<Phone className={ICON} aria-hidden="true" />}
            placeholder="10-digit mobile"
            invalid={!!errors.phoneNo}
            {...register("phoneNo")}
          />
        </Field>
        <Field label="Email" htmlFor={`${uid}-email`} error={errors.email?.message}>
          <TextInput
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            icon={<Mail className={ICON} aria-hidden="true" />}
            placeholder="you@example.com"
            invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field label="Graduation year" htmlFor={`${uid}-grad`} error={errors.graduationYear?.message}>
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

      <fieldset>
        <legend className="mb-2 block text-sm font-bold text-[#0F172A]">I am a</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {STATUS_OPTIONS.map((opt) => {
            const selected = details === opt.value;
            const Icon = opt.icon;
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] p-3.5 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#2451D6]/20",
                  selected
                    ? "border-[#2451D6] bg-[#F4F7FF]"
                    : errors.details
                      ? "border-red-300 bg-white"
                      : "border-[#E4E8F0] bg-white hover:border-[#B9CBF3]",
                )}
              >
                <input type="radio" value={opt.value} className="sr-only" {...register("details")} />
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    selected ? "bg-[#2451D6] text-white" : "bg-[#F1F4F9] text-[#5B6478]",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold">{opt.title}</span>
                  <span className="block text-[13px] text-[#5B6478]">{opt.hint}</span>
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
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        {working && (
          <>
            <Field label="Current company" htmlFor={`${uid}-company`} error={errors.currentCompany?.message}>
              <TextInput
                id={`${uid}-company`}
                autoComplete="organization"
                icon={<Building2 className={ICON} aria-hidden="true" />}
                placeholder="e.g. Infosys"
                invalid={!!errors.currentCompany}
                {...register("currentCompany")}
              />
            </Field>
            <Field label="Current CTC" htmlFor={`${uid}-ctc`} error={errors.currentCtc?.message}>
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
          className="sm:col-span-2"
        >
          <SelectInput
            id={`${uid}-domain`}
            icon={<Layers className={ICON} aria-hidden="true" />}
            placeholder={working ? "The field you work in" : "The field you want to work in"}
            options={domainOptions}
            invalid={!!errors.domain}
            {...register("domain")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Password" htmlFor={`${uid}-password`} error={errors.password?.message ? "Password doesn't meet the rules below" : undefined}>
          <PasswordInput
            id={`${uid}-password`}
            autoComplete="new-password"
            placeholder="Create a password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <Field label="Confirm password" htmlFor={`${uid}-confirm`} error={errors.confirmPassword?.message}>
          <PasswordInput
            id={`${uid}-confirm`}
            autoComplete="new-password"
            placeholder="Repeat password"
            invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </Field>
      </div>
      <div className="-mt-3">
        <PasswordRules value={password} />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#2451D6] text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(36,81,214,0.25)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-wait disabled:opacity-80"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? "Creating your account…" : "Create account"}
      </button>
    </form>
  );
}
