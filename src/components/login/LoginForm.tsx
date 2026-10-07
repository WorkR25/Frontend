"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import { Field, TextInput } from "@/components/me/profileUi";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { LogInFormSchema } from "@/schema/logIn.validator";
import { safeReturnUrl } from "@/utils/safeReturnUrl";
import useGetUser from "@/utils/useGetUser";
import useLogin from "@/utils/useLogin";

type LogInFormValues = z.infer<typeof LogInFormSchema>;

export default function LogInForm() {
  const searchParams = useSearchParams();
  const rawReturnUrl = searchParams.get("returnUrl");
  const signupHref = rawReturnUrl ? `/signup?returnUrl=${encodeURIComponent(rawReturnUrl)}` : "/signup";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to explore jobs and keep your profile up to date."
      switchText="New to WorkR?"
      switchLabel="Create an account"
      switchHref={signupHref}
    >
      <Form returnUrl={safeReturnUrl(rawReturnUrl)} />
    </AuthShell>
  );
}

function Form({ returnUrl }: { returnUrl: string }) {
  const uid = useId();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormValues>({
    mode: "onTouched",
    resolver: zodResolver(LogInFormSchema),
  });

  // Already logged in? Skip the form.
  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) dispatch(setAuthJwtToken(token));
  }, [dispatch]);
  const { data, isSuccess: hasUser } = useGetUser(jwtToken);
  useEffect(() => {
    if (hasUser && data) router.push(returnUrl);
  }, [hasUser, data, router, returnUrl]);

  const { mutate, isPending, isSuccess } = useLogin();
  const busy = isPending || isSuccess;

  const onSubmit = (values: LogInFormValues) => {
    mutate(values, { onSuccess: () => router.push(returnUrl) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Field label="Email" htmlFor={`${uid}-email`} error={errors.email?.message}>
        <TextInput
          id={`${uid}-email`}
          type="email"
          autoComplete="email"
          icon={<Mail className="h-[18px] w-[18px]" aria-hidden="true" />}
          placeholder="you@example.com"
          invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Field label="Password" htmlFor={`${uid}-password`} error={errors.password?.message}>
        <PasswordInput
          id={`${uid}-password`}
          autoComplete="current-password"
          placeholder="Your password"
          invalid={!!errors.password}
          {...register("password")}
        />
      </Field>

      <button
        type="submit"
        disabled={busy}
        className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#2451D6] text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(36,81,214,0.25)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-wait disabled:opacity-80"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
