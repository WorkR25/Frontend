"use client";
import React, { useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store.config";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import useGetUser from "@/utils/useGetUser";
import { useRouter } from "next/navigation";
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";

export default function UserProfileSidebar() {
  const router = useRouter();
  const authJwtToken = useSelector(
    (state: RootState) => state.authJwtToken.value
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const jwt = localStorage.getItem("AuthJwtToken");

      if (jwt) {
        dispatch(setAuthJwtToken(jwt));
      }
    }
  }, [dispatch]);

  const { data, isPending } = useGetUser(authJwtToken);

  // useEffect(() => {
  //   if (isError) {
  //     router.replace("/login");
  //   }
  // }, [data, isError, router]);

  if(authJwtToken.length==0){
    return <button className="w-full text-center bg-blue-200 rounded-lg px-2 py-1 hover:cursor-pointer hover:bg-gray-200" onClick={()=>{router.replace('/login')}}>Login</button>;

  }

  if(isPending){
    return <div className="text-center">Loading...</div>
  }


  if (!data) {
    return <button className="w-full text-center bg-blue-200 rounded-2xl px-2 py-1 hover:cursor-pointer hover:bg-gray-200" onClick={()=>{router.replace('/login')}}>Login</button>;
  }

  return (
    <div onClick={()=>{
      router.push('/dashboard/me')
      dispatch(isSidebarOpenToogle(false))
    }} className="components-UserProfileSidebar w-full bottom-0 hover:cursor-pointer ">
      <div className="components-UserProfileSidebar flex items-center gap-3 p-3 bg-gray-100 rounded-lg w-full shadow-sm">
        <div className="components-UserProfileSidebar w-0 sm:w-10 h-0 sm:h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold text-lg">
          {data?.fullName[0]}
        </div>
        <div className="components-UserProfileSidebar flex flex-col justify-center">
          <p className="components-UserProfileSidebar text-sm font-medium text-black">{data?.fullName}</p>
          <p className="components-UserProfileSidebar text-xs text-gray-500">{data?.email}</p>
        </div>
        <div className="components-UserProfileSidebar ml-auto">
          <ChevronUp className="components-UserProfileSidebar w-4 h-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
