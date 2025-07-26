'use client';
import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useGetUser } from "@/utils/useGetUser";

export default function UserProfileSidebar() {
  const [authJwtToken, setAuthJwtToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthJwtToken(localStorage.getItem("AuthJwtToken"));
    }
  }, []);


  const { data } = useGetUser(authJwtToken);  

  console.log("rendered")
  return (
    <div className="sticky bottom-0 ">
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