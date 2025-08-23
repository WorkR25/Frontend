"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect } from "react";
import InputField from "../InputField";
import useGetUser from "@/utils/useGetUser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store.config";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import useUpdateUserDetails from "@/utils/useUpdateUserDetails";
import { toast } from "react-toastify";

const UserDetailSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNo: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
});

export type UserDetailFormValues = z.infer<typeof UserDetailSchema>;

export default function UserDetailForm() {
    const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserDetailFormValues>({
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: zodResolver(UserDetailSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNo: "",
    },
  });
  const jwtToken = useSelector((state: RootState)=>{return state.authJwtToken.value})
  useEffect(()=>{
    const token = localStorage.getItem("AuthJwtToken");
    if(token){
        dispatch(setAuthJwtToken(token));
    }
  }, [dispatch])

  const { data: userData } = useGetUser(jwtToken)

  useEffect(()=>{
    reset(userData) ;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userData])

  const { mutate: userDetailsMutate }= useUpdateUserDetails();
  const onSubmit = (data: UserDetailFormValues) => {
    userDetailsMutate({ authJwtToken: jwtToken, id: String(userData?.id), userDetails: data }, {
        onSuccess:()=>{
            toast.success("User details updated successfully");
        }
    });
  };

  return (
    <div>
      <div>
        <div className="font-semibold text-lg mt-3">User Details</div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-md w-full">
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

          <button type="submit">Submit Details</button>
        </form>
      </div>
    </div>
  );
}
