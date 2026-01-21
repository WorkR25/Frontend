"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import useGetUser from "@/utils/useGetUser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store.config";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import useUpdateUserDetails from "@/utils/useUpdateUserDetails";
import { toast } from "react-toastify";
import { UserDetailSchema } from "@/schema/userDetails.validator";
import { useRouter } from "next/navigation";
import TripleDotLoader from "../TripleDotLoader";


export type UserDetailFormValues = z.infer<typeof UserDetailSchema>;

export default function UserDetailForm() {
    const dispatch = useDispatch();
  const methods = useForm<UserDetailFormValues>({
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: zodResolver(UserDetailSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNo: "",
      graduationYear: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const jwtToken = useSelector((state: RootState)=>{return state.authJwtToken.value})
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem("AuthJwtToken");
    if(token){
        dispatch(setAuthJwtToken(token));
    }else{
      router.replace("/login")
    }
  }, [dispatch, router])

  useEffect(()=>{
    setMounted(true);
  },[])


  const { data: userData } = useGetUser(jwtToken)

  useEffect(()=>{
    reset(userData) ;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userData])

  const { mutate: userDetailsMutate, isPending }= useUpdateUserDetails();
  const onSubmit = (data: UserDetailFormValues) => {
    userDetailsMutate({ authJwtToken: jwtToken, id: String(userData?.id), userDetails: data }, {
        onSuccess:()=>{
            toast.success("User details updated successfully");
        }
    });
  };

  if(!mounted) return null ;

  return (
    <FormProvider {...methods}>
    <div>
      <div>
        {isPending && (
          <TripleDotLoader />
        )}
        <div className="components-me-UserDetailForm font-semibold text-lg mt-3">User Details</div>
        <form onSubmit={handleSubmit(onSubmit)} className="components-me-UserDetailForm space-y-4 p-4 border rounded-lg shadow-md w-full">
          <div>Full Name</div>
          <InputField
            register={register}
            fieldName="fullName"
            placeholder="Haiiatama"
            type="text"
            icon={<></>}
            error={errors.fullName}
            fieldValue= {userData?.fullName || watch("fullName")}
            />
          <div>Email</div>
          <InputField
            register={register}
            fieldName="email"
            placeholder="example@example.com"
            icon={<></>}
            type="text"
            error={errors.email}
            fieldValue= {userData?.email || watch('email')}
            />
          <div>Phone No</div>
          <InputField
            register={register}
            fieldName="phoneNo"
            placeholder="9087654321"
            type="text"
            icon={<></>}
            error={errors.phoneNo}
            fieldValue= {userData?.phoneNo || watch('phoneNo')}
            />
          <div>Graduation Year</div>
          <InputField
            register={register}
            fieldName="graduationYear"
            placeholder="Graduation Year( e.g 2024 )"
            type="text"
            icon={<></>}
            error={errors.graduationYear}
            fieldValue= {userData?.graduationYear || watch('graduationYear')}
            />
          
          <button
          type="submit"
          className="components-me-UserDetailForm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          >
          Save Details
        </button>
        </form>
      </div>
    </div>
  </FormProvider>
  );
}
