// "use client";

// import { useForm } from "react-hook-form";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import z from "zod";
// import { LogInFormSchema } from "@/schema/logIn.validator";
// import { zodResolver } from "@hookform/resolvers/zod";
// import useLogin from "@/utils/useLogin";
// import InputField from "../InputField";
// // import ErrorPopup from "../ErrorPopup";
// import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
// import useGetUser from "@/utils/useGetUser";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";

// type LogInFormValues = z.infer<typeof LogInFormSchema>;

// export default function LogInForm() {
//   const router = useRouter();
//   return (
//     <div className="relative w-full h-full ">
//       <div className=" top-0 left-0 p-6 pt-3">
//         <Image
//           src="/WorkR-Full-Logo2.png"
//           alt="photo"
//           width={80}
//           height={80}
//           objectFit="cover"
//           priority
//         />
//       </div>
//       <div className="flex items-center justify-center mt-[10vh]">
//         <div className=" w-full sm:w-[60%] text-center mt-[4vh]">
//           <div className="text-lg font-semibold">Log In to Your Account</div>
//           <div className="text-sm px-4">
//             Welcome to Workr ! Log In to get Started
//           </div>
//           <Form />
//         </div>
//         <div></div>
//       </div>
//       <div className=" bottom-0 flex items-center justify-center text-sm">
//         <div>Dont have an account?</div>
//         <button
//           className="text-[#467FA3] hover:cursor-pointer"
//           onClick={() => {
//             router.push("/signup");
//           }}
//         >
//           Sign Up
//         </button>
//       </div>
//     </div>
//   );
// }

// function Form() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm<LogInFormValues>({
//     mode: "onChange",
//     reValidateMode: "onBlur",
//     resolver: zodResolver(LogInFormSchema),
//   });
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const jwtToken = useAppSelector((state) => state.authJwtToken.value);

//   useEffect(() => {
//     const token = localStorage.getItem("AuthJwtToken");
//     if (token) {
//       dispatch(setAuthJwtToken(token));
//     } else {
//       // router.replace("/login");
//     }
//   }, [dispatch, router]);

//   const searchParams = useSearchParams();
//   const returnUrl = searchParams.get("returnUrl");
//   const { data, isSuccess: getUserSuccess } = useGetUser(jwtToken);
//   useEffect(() => {
//     if (getUserSuccess && data) {
//       router.push(returnUrl || "/dashboard");
//     }
//   }, [getUserSuccess, data, router, returnUrl]);
//   const { mutate, isPending, isSuccess } = useLogin();

//   const [showPassword, setShowPassword] = useState(false);

//   const onSubmit = (logInData: LogInFormValues) => {
//     mutate(logInData, {
//       onSuccess: () => {
//         router.push(returnUrl || "/dashboard");
//       },
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="max-w-md mx-auto space-y-2 py-6 rounded-lg font-poppins text-sm px-8 "
//     >
//       {/* {isError ? <ErrorPopup message="Error while logging in" /> : <></>} */}

//       <InputField
//         register={register}
//         fieldName="email"
//         placeholder="Email Address"
//         type="email"
//         icon={<Mail size={20} />}
//       />
//       {errors.email?.message && (
//         <p className="text-[#E04B40] text-xs">Enter valid email</p>
//       )}

//       <InputField
//         register={register}
//         onChangeFn={(e) => {
//           setValue("password", e.target.value, { shouldValidate: true });
//         }}
//         fieldName="password"
//         placeholder="Password"
//         type={showPassword ? "text" : "password"}
//         icon={<Lock size={20} />}
//         other={
//           <span
//             className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </span>
//         }
//       />
//       {errors.password?.message && (
//         <p className="text-[#E04B40] text-xs">{errors.password.message}</p>
//       )}

//       <button
//         type="submit"
//         disabled={!!errors.password || !!errors.email}
//         className={` border border-[#F0F0F0] w-full py-1.5 rounded-md font-bold ${
//           errors.password || errors.email
//             ? "cursor-not-allowed text-[#DDDDDD] bg-[#F0F0F0]"
//             : "bg-[#3177a7] cursor-pointer hover:bg-[#7ba1d0]"
//         }`}
//       >
//         {isPending || isSuccess ? " Logging in " : " Log in "}
//       </button>
//     </form>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { LogInFormSchema } from "@/schema/logIn.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "@/utils/useLogin";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import useGetUser from "@/utils/useGetUser";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import SignupTextInput from "../signup/SignupTextInput";

type LogInFormValues = z.infer<typeof LogInFormSchema>;

export default function LogInForm() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-full p-3 w-full flex-col overflow-hidden">
      <div className="flex justify-center px-8 pt-3">
        <Image
          src="/WorkR-Full-Logo2.png"
          alt="WorkR Logo"
          width={138}
          height={42}
          priority
          className="h-auto w-[100px]"
        />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 pb-8 pt-8 sm:px-10 sm:pt-0">
        <div className="w-full max-w-[440px] text-center">
          <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-[#263243] sm:text-[28px]">
            Log In to Your Account
          </h1>

          <p className=" text-[12px] font-normal text-[#66788C]">
            Welcome to WorkR! Log in to get started
          </p>

          <Form />
        </div>
      </div>

      <div className="pb-4 text-center text-[15px] text-[#445366]">
        <span>Don&apos;t have an account? </span>
        <button
          className="font-medium text-[#1681D8] transition hover:cursor-pointer hover:text-[#0D63AA]"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LogInFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(LogInFormSchema),
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const { data, isSuccess: getUserSuccess } = useGetUser(jwtToken);

  useEffect(() => {
    if (getUserSuccess && data) {
      router.push(returnUrl || "/dashboard");
    }
  }, [getUserSuccess, data, router, returnUrl]);

  const { mutate, isPending, isSuccess } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (logInData: LogInFormValues) => {
    mutate(logInData, {
      onSuccess: () => {
        router.push(returnUrl || "/dashboard");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-6 w-full space-y-2 px-2"
    >
      {/* <div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
            <Mail size={20} strokeWidth={2.1} />
          </span>

          <input
            {...register("email")}
            type="email"
            placeholder="Email Address"
            className="h-[64px] w-full rounded-[18px] border border-[#D7E4F0] bg-white pl-[72px] pr-4 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF]"
          />
        </div>

        {errors.email?.message && (
          <p className="mt-2 text-left text-xs text-[#E04B40]">
            Enter valid email
          </p>
        )}
      </div> */}

      <SignupTextInput
        error={errors.email}
        fieldName="email"
        icon={<Mail size={20} />}
        placeholder="Email Address"
        register={register}
      />

      {/* <div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
            <Lock size={20} strokeWidth={2.1} />
          </span>

          <input
            {...register("password")}
            onChange={(e) => {
              setValue("password", e.target.value, { shouldValidate: true });
            }}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-[64px] w-full rounded-[18px] border border-[#D7E4F0] bg-white pl-[72px] pr-14 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF]"
          />

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#243446] hover:cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={21} strokeWidth={2.1} />
            ) : (
              <Eye size={21} strokeWidth={2.1} />
            )}
          </button>
        </div>

        {errors.password?.message && (
          <p className="mt-2 text-left text-xs text-[#E04B40]">
            {errors.password.message}
          </p>
        )}
      </div> */}

      <div>
        <div className="relative">
          <span className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
            <Lock size={20} strokeWidth={2.1} />
          </span>

          <input
            {...register("password")}
            onChange={(e) => {
              setValue("password", e.target.value, { shouldValidate: true });
            }}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-[44px] w-full rounded-[14px] border border-[#D7E4F0] bg-white pl-[47px] pr-14 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF]"
          />

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#243446] hover:cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={21} strokeWidth={2.1} />
            ) : (
              <Eye size={21} strokeWidth={2.1} />
            )}
          </button>
        </div>

        {errors.password?.message && (
          <p className="mt-2 text-left text-xs text-[#E04B40]">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!!errors.password || !!errors.email || isPending}
        className={`mt-1 h-[40px] w-full rounded-[14px] text-[17px] font-semibold text-white transition ${
          errors.password || errors.email || isPending
            ? "cursor-not-allowed bg-[#C8D6E4]"
            : "cursor-pointer bg-[linear-gradient(90deg,#0F67B8_0%,#1681D8_55%,#0D72CC_100%)] shadow-[0_10px_24px_rgba(22,129,216,0.24)] hover:brightness-[1.03]"
        }`}
      >
        {isPending || isSuccess ? "Logging in" : "Log In"}
      </button>
    </form>
  );
}
