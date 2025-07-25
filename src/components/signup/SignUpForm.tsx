"use client";

import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "@/schema/signUp.validator";


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
      <div className="flex items-center justify-center ">
        <div className=" w-[28vw] text-center mt-[4vh]">
          <div className="text-lg font-semibold">Create Your Account</div>
          <div className="text-sm">
            Welcome to Workr! Let’s get started by creating your Account
          </div>
          <Form />
        </div>
      </div>
      <div className=" bottom-0 flex items-center justify-center text-sm">
        <div>Already have an account? </div>
        <div
          className="text-[#467FA3] hover:cursor-pointer"
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </div>
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
    resolver: zodResolver(SignUpFormSchema),
  });
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = (data: FormValues) => {
    if (password === confirmPassword) {
      console.log("correct ");
    }
    console.log(errors);

    console.log("data");
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-2 py-6 rounded-lg font-poppins text-sm "
    >

      <div className="relative">
        <User
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]"
          size={20}
        />
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Haiiatama"
          className="w-full pl-10 pr-3 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 "
        />
      </div>
      {errors.name?.message && (
        <p className="text-[#E04B40] text-xs">Enter your name</p>
      )}


      <div className="relative">
        <Mail
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]"
          size={20}
        />
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="haikaa@example.com"
          className="w-full pl-10 pr-3 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 "
        />
      </div>
      {errors.email?.message && (
        <p className="text-[#E04B40] text-xs">Enter enter valid email</p>
      )}


      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]"
          size={20}
        />
        <input
          {...register("password", { required: true })}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className={`w-full pl-10 pr-10 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 ${
            errors.confirmPassword ? "border-[#E04B40]" : ""
          }`}
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>
      {errors.password?.message && (
        <p className="text-[#E04B40] text-xs">{errors.password.message}</p>
      )}


      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]"
          size={20}
        />
        <input
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === password,
          })}
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          className={`w-full pl-10 pr-10 py-2 border border-[#E0E0E0]${
            errors.confirmPassword ? "border-[#E04B40]" : ""
          } rounded-md focus:outline-none focus:ring-2 `}
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
          onClick={() => setShowConfirm(!showConfirm)}
        >
          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <p
        className={`${
          (errors.confirmPassword) ? "text-[#E04B40] text-xs" : "hidden"
        }`}
      >
        Passwords do not match. Please ensure both passwords are the same.
      </p>

      <button
        type="submit"
        className={` border border-[#F0F0F0] w-full py-1.5 rounded-md font-bold ${
          (errors.confirmPassword)
            ? "cursor-not-allowed text-[#DDDDDD] bg-[#F0F0F0]"
            : "bg-[#3177a7] cursor-pointer hover:bg-[#7ba1d0]"
        }`}
      >
        Submit
      </button>
    </form>
  );
}
