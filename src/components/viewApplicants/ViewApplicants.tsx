"use client";

import { toogleShowJobApplicants } from "@/features/showJobApplicants/showJobApplicantsSlice";
import { RootState } from "@/lib/store.config";
import { cn } from "@/utils/cn";
import useGetJobApplicants from "@/utils/useGetJobApplicants";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ApplicantCard from "./ApplicantCard";

export default function ViewApplicants({ jobId, className }: { jobId: number, className?: string }) {
  const dispatch = useDispatch();

  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });

  const { data: applicantList } = useGetJobApplicants(jwtToken, jobId);

  return (
    <div className={cn("component-viewApplicants-ViewApplicants justify-center ", className)}>
      <div
        className="component-viewApplicants-ViewApplicants absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(toogleShowJobApplicants());
        }}
      >
        <X width={20} />
      </div>
      <div className="component-viewApplicants-ViewApplicants w-full text-center m-3 mt-5 text-xl">Applicants </div>
      {
        !applicantList?.length  && (
            <div className="component-viewApplicants-ViewApplicants w-full text-center" >No applicant</div>
        )
      }
      {applicantList && applicantList?.map((applicant)=>{
        return (
            <div key={applicant.id} className="component-viewApplicants-ViewApplicants rounded m-3 ">
                <ApplicantCard resumeUrl={applicant.profile.resumeUrl} city= {applicant.phoneNo} email={applicant.email} name={applicant.fullName} />
            </div>
        )
      })}
    </div>
  );
}
