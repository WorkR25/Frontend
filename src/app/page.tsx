'use client' ;

import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { RootState } from "@/lib/store.config";
import useGetUser from "@/utils/useGetUser";
import {  useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const router = useRouter() ;
  const dispatch = useDispatch();
  
  useEffect(()=>{
    const token = localStorage.getItem('AuthJwtToken') ;
    if(token){
      dispatch(setAuthJwtToken(token)) ;
    }
    router.replace('/dashboard')
  },[dispatch, router])

  
  const jwtToken = useSelector((state: RootState)=>{return state.authJwtToken.value})
  const {  } = useGetUser(jwtToken);

// useEffect(() => {
//   if (isLoading) return; // wait for query to finish

//   if (isSuccess && data) {
//     router.push("/dashboard");
//   }

//   if (isError) {
//     router.push("/login"); // or redirect("/login") in App Router
//   }
// }, [isSuccess, isError, isLoading, data, router]);

}