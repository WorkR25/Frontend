"use client";

import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import z from "zod";
import { LogInFormSchema } from "@/schema/logIn.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "@/utils/useLogin";

type LogInFormValues = z.infer<typeof LogInFormSchema>;

export default function LogInForm() {
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
      <div className="flex items-center justify-center mt-[10vh]">
        <div className=" w-[70vw] sm:w-[35vw] text-center mt-[4vh]">
          <div className="text-lg font-semibold">Log In to Your Account</div>
          <div className="text-sm">
            Welcome to Workr ! Log In to get Started
          </div>
          <Form />
        </div>
        <div></div>
      </div>
      <div className=" bottom-0 flex items-center justify-center text-sm">
        <div>Dont have an account?</div>
        <div
          className="text-[#467FA3] hover:cursor-pointer"
          onClick={() => {
            router.push("/signup");
          }}
        >
          {" "}
          Sign Up
        </div>
      </div>
    </div>
  );
}

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormValues>({
    resolver: zodResolver(LogInFormSchema),
  });

  const { mutate } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (logInData: LogInFormValues) => {
    mutate(logInData);
  };
 

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-2 py-6 rounded-lg font-poppins text-sm px-8 "
    >
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
        <p className="text-[#E04B40] text-xs">Enter valid email</p>
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
            errors.password ? "border-[#E04B40]" : ""
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

      <button
        type="submit"
        className={` border border-[#F0F0F0] w-full py-1.5 rounded-md font-bold ${
          errors.password || errors.email
            ? "cursor-not-allowed text-[#DDDDDD] bg-[#F0F0F0]"
            : "bg-[#3177a7] cursor-pointer hover:bg-[#7ba1d0]"
        }`}
      >
        Log In
      </button>
    </form>
  );
}
