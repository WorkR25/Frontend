"use client";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import BackButton from "@/components/BackButton";
import JobDetailsCard from "@/components/jobDetails/JobDetailsCard";
import JobDescription from "@/components/jobDetails/JobDescription";
import JobSpecification from "@/components/jobDetails/JobSpecification";
import { useDispatch, useSelector } from "react-redux";
import { use, useEffect } from "react";
import { setJobId } from "@/features/jobId/jobId";
import { RootState } from "@/lib/store.config";
import useGetJobDetails from "@/utils/useGetJobDetails";
import { ToastContainer } from "react-toastify";

export default function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const dispatch = useDispatch();

  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });
  const jobDetails = useSelector((state: RootState) => {
    return state.jobDetails.value;
  });

  useGetJobDetails(jwtToken, jobId);
  useEffect(() => {
    console.log("job id : ", jwtToken);
    dispatch(setJobId(jobId));
  });

  if (!jobDetails) {
    return <div>Not found</div>;
  }

  return (
    <div className="jobId-page text-black bg-white h-screen flex flex-col p-2">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="jobId-page flex items-center ">
        <div className="jobId-page basis-[5%] ">
          <BackButton />
        </div>
        <DashboardTopbar className="basis-[95%]" pageName="Job Details" />
      </div>
       <JobDetailsCard
        img={jobDetails?.companyId.logo}
        title={jobDetails.jobTitle.title}
        companyName={jobDetails?.companyId.name}
        city={jobDetails.city.name}
        jobId={Number(jobId)}
      />
      <div className="jobId-page flex flex-1 overflow-hidden">
        <div className="jobId-page basis-35/50 overflow-y-auto p-4 min-h-0">
          <JobDescription />
        </div>
        <div className="jobId-page basis-15/50 overflow-y-auto p-4 min-h-0">
          <JobSpecification
            experienceLevel={jobDetails.experienceLevel.name}
            employmentType={jobDetails.employmentType.name}
            salaryMax={jobDetails.salary_max}
            salaryMin={jobDetails.salary_min}
            workType={jobDetails.is_remote}
            img={jobDetails.companyId.logo}
            city={jobDetails.city.name}
            companyName={jobDetails.companyId.name}
          />
        </div>
      </div>
    </div>
  );
}
