"use client";
import React, { useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store.config";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import useGetUser from "@/utils/useGetUser";
import { useRouter } from "next/navigation";

export default function UserProfileSidebar() {
  const router = useRouter();
  const authJwtToken = useSelector(
    (state: RootState) => state.authJwtToken.value
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const jwt = localStorage.getItem("AuthJwtToken");

      if (!jwt) {
        router.replace("/login");
      }

      if (jwt) {
        dispatch(setAuthJwtToken(jwt));
      }
    }
  }, [dispatch, router]);

  const { data } = useGetUser(authJwtToken);

  // useEffect(() => {
  //   if (isError) {
  //     router.replace("/login");
  //   }
  // }, [data, isError, router]);


  if (!data) {
    return <div className="text-center">Loading user...</div>;
  }

  return (
    <div onClick={()=>{
      router.push('dashboard/me')
    }} className=" w-full bottom-0 hover:cursor-pointer ">
      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg w-full shadow-sm">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold text-lg">
          {data?.fullName[0]}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-black">{data?.fullName}</p>
          <p className="text-xs text-gray-500">{data?.email}</p>
        </div>
        <div className="ml-auto">
          <ChevronUp className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
