import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { RootState } from "@/lib/store.config";
import useCreateApplication from "@/utils/useCreateApplication";
import { Bookmark, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type JobDetailsCardProps= {
  jobId: number ;
  img: string;
  title: string;
  companyName: string;
  city: string;
}
export default function JobDetailsCard({
  jobId, 
  img,
  title,
  companyName,
  city,
}: JobDetailsCardProps) {
  console.log( "job details job id", jobId)
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState)=> {return state.authJwtToken.value})
  
  useEffect(()=>{
    if(!jwtToken){
      const jwt = localStorage.getItem('AuthJwtToken');
      dispatch(setAuthJwtToken(String(jwt)))
    }
  }, [dispatch, jwtToken])

  const { mutate }=  useCreateApplication() ;
  return (
    <div className="components-jobDetails-JobDetailsCard bg-gradient-to-r from-[#0052CC] to-[#0073E6] text-white p-4 rounded-xl flex items-center justify-between shadow-md w-full ">
      <div className="components-jobDetails-JobDetailsCard flex items-center gap-4">
        <div className="components-jobDetails-JobDetailsCard w-12 h-12 rounded-md overflow-hidden bg-white p-1">
          <Image
            src={img ? img : "/google-icon-logo-svgrepo-com.svg"}
            alt="Company Logo"
            width={48}
            height={48}
            className="components-jobDetails-JobDetailsCard object-contain"
          />
        </div>

        <div className="components-jobDetails-JobDetailsCard space-y-1">
          <div className="components-jobDetails-JobDetailsCard text-sm text-white/80">
            3 days ago · 294 applicants
          </div>
          <div className="components-jobDetails-JobDetailsCard font-semibold text-lg flex items-center gap-2">
            {title}
            <span className="components-jobDetails-JobDetailsCard text-xs bg-yellow-400 text-blue-800 px-2 py-0.5 rounded-full">
              Closed Hiring
            </span>
          </div>
          <div className="components-jobDetails-JobDetailsCard text-sm text-white/90">
            {companyName+` ,  `} {city}
          </div>
        </div>
      </div>
      <div className="components-jobDetails-JobDetailsCard flex items-center gap-2">
        <button className="components-jobDetails-JobDetailsCard bg-white/20 hover:bg-white/30 p-2 rounded-md">
          <Bookmark size={16} />
        </button>
        <button className="components-jobDetails-JobDetailsCard bg-white/20 hover:bg-white/30 p-2 rounded-md">
          <MoreHorizontal size={16} />
        </button>
        <button onClick={()=>{mutate({jobId, jwtToken})}} className="components-jobDetails-JobDetailsCard hover:cursor-pointer hover:bg-[#cedcf1] ml-3 bg-white text-[#0052CC] px-4 py-1.5 rounded-md text-sm  cursor-not-allowed">
          Apply Now
        </button>
      </div>
    </div>
  );
}