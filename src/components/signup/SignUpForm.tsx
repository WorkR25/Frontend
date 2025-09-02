"use client";

import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import useSignup from "@/utils/useSignup";

type FormValues = z.infer<typeof SignUpFormSchema>;

export default function SignUpForm() {
  const router = useRouter();
  return (
    <div className="relative w-full h-full ">
      <div className=" top-0 left-0 p-6 pt-3">
        <Image
          src="/WorkR-Logo.svg"
          alt="photo"
          width={80}
          height={80}
          objectFit="cover"
          priority
        />
      </div>
      <div className="flex items-center justify-center mt-[2vh]">
        <div className=" w-[100%] sm:w-[60%] text-center mt-[4vh]">
          <div className="text-lg font-semibold">Create Your Account</div>
          <div className="text-sm px-4">
            Welcome to Workr! Let’s get started by creating your Account
          </div>
          <Form />
        </div>
      </div>
      <div className=" bottom-0 flex items-center justify-center text-sm">
        <div>Already have an account? </div>
        <button
          className="text-[#467FA3] hover:cursor-pointer"
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
}

function Form() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",      
    reValidateMode: "onBlur",
    resolver: zodResolver(SignUpFormSchema),
  });

  const router = useRouter();
  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate,  isPending, isSuccess } = useSignup();

  useEffect(()=>{
      if(isSuccess){
      router.replace('/dashboard');
    }
  }, [isSuccess, router]);

  const onSubmit = (formData: FormValues) => {
    mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-2 py-6 rounded-lg font-poppins text-sm px-8"
    >
      {/* {isError ? (<ErrorPopup message="Error while Siging up" />):(<></>)} */}

      <InputField
        register={register}
        fieldName="fullName"
        placeholder="Haiiatama"
        type="text"
        icon={<User size={20} />}
      />
      {errors.fullName?.message && (
        <p className="text-[#E04B40] text-xs">Enter your name</p>
      )}

      <InputField
        register={register}
        fieldName="phoneNo"
        placeholder="9087654321"
        type="text"
        icon={<Phone size={20} />}
      />
      {errors.phoneNo?.message && (
        <p className="text-[#E04B40] text-xs">{errors.phoneNo.message}</p>
      )}

      <InputField
        register={register}
        fieldName="email"
        placeholder="haikaa@example.com"
        type="email"
        icon={<Mail size={20} />}
      />
      {errors.email?.message && (
        <p className="text-[#E04B40] text-xs">Enter enter valid email</p>
      )}

      <InputField
        register={register}
        fieldName="password"
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        icon={<Lock size={20} />}
        other={
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        }
      />
      {errors.password?.message && (
        <p className="text-[#E04B40] text-xs">{errors.password.message}</p>
      )}

      <InputField
        register={register}
        fieldName="confirmPassword"
        placeholder="Confirm Password"
        type={showConfirm ? "text" : "password"}
        icon={<Lock size={20} />}
        other={
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        }
        validate={(value) => value === password}
      />
      <p
        className={`${
          errors.confirmPassword ? "text-[#E04B40] text-xs" : "hidden"
        }`}
      >
        Passwords do not match. Please ensure both passwords are the same.
      </p>

      <button
        type="submit"
        disabled={
          !!errors.confirmPassword ||
          !!errors.password ||
          !!errors.email ||
          !!errors.fullName ||
          !!errors.phoneNo
        }
        className={` border border-[#F0F0F0] w-full py-1.5 rounded-md font-bold ${
          errors.confirmPassword ||
          errors.password ||
          errors.email ||
          errors.fullName ||
          errors.phoneNo
            ? "cursor-not-allowed text-[#DDDDDD] bg-[#F0F0F0]"
            : "bg-[#3177a7] cursor-pointer hover:bg-[#7ba1d0]"
        }`}
      >
        {isPending || isSuccess ? "Signing Up" : "Sign up"}
      </button>
    </form>
  );
}
