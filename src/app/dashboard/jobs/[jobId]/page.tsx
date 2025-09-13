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
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import TripleDotLoader from "@/components/TripleDotLoader";
import { setJobDetails } from "@/features/jobDetails/jobDetails";
import CompanyCard from "@/components/jobDetails/CompanyCard";
import JobSkills from "@/components/jobDetails/JobSkills";

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

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  const { data, isPending, isError } = useGetJobDetails(jwtToken, jobId);

  useEffect(() => {
    dispatch(setJobId(jobId));
  });

  useEffect(() => {
    if (data) {
      dispatch(setJobDetails(data));
    }
  }, [data, dispatch]);

  if (!jobDetails)
    return (
      <div>
        <TripleDotLoader />
      </div>
    );

  if (isPending) {
    return (
      <div>
        <TripleDotLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex text-center items-center justify-center ">
        Not found
      </div>
    );
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
        img={jobDetails?.company.logo}
        title={jobDetails.jobTitle.title}
        companyName={jobDetails?.company.name}
        city={jobDetails.city.name}
        jobId={Number(jobId)}
        created_at={jobDetails.created_at}
        apply_link={jobDetails.apply_link}
      />
      <div className="jobId-page sm:flex flex-1 overflow-y-scroll sm:overflow-hidden">
        <div className="jobId-page sm:hidden overflow-y-auto p-4 min-h-0">
          <JobSpecification
            experienceLevelName={jobDetails.experienceLevel.name}
            experienceLevel={`${jobDetails.experienceLevel.min_years} - ${jobDetails.experienceLevel.max_years} years`}
            employmentType={jobDetails.employmentType.name}
            salaryMax={jobDetails.salary_max}
            salaryMin={jobDetails.salary_min}
            workType={jobDetails.is_remote}
            img={jobDetails.company.logo}
            city={jobDetails.city.name}
            companyName={jobDetails.company.name}
          />
          <JobSkills skills={jobDetails.skills} />
          <CompanyCard
            description={jobDetails.company.description ?? "Description"}
            industry={
              jobDetails.company.industry
                ? jobDetails.company.industry.name
                : "industry"
            }
            location={jobDetails.city.name}
            logoUrl={jobDetails.company.logo}
            name={jobDetails.company.name}
            size={
              jobDetails.company.companySize
                ? `${jobDetails.company.companySize.min_employees ?? "min"} ${
                    jobDetails.company.companySize.max_employees
                      ? jobDetails.company.companySize.max_employees > 100002
                        ? "+"
                        : `- ${jobDetails.company.companySize.max_employees}`
                      : "max"
                  } employees`
                : "Company Size"
            }
          />
        </div>
        <div className="jobId-page sm:basis-35/50 overflow-y-auto p-4 min-h-0">
          <JobDescription />
        </div>
        <div className="jobId-page hidden sm:block sm:basis-15/50 overflow-y-auto p-4 min-h-0">
          <JobSpecification
            experienceLevelName={jobDetails.experienceLevel.name}
            experienceLevel={`${jobDetails.experienceLevel.min_years} - ${jobDetails.experienceLevel.max_years} years`}
            employmentType={jobDetails.employmentType.name}
            salaryMax={jobDetails.salary_max}
            salaryMin={jobDetails.salary_min}
            workType={jobDetails.is_remote}
            img={jobDetails.company.logo}
            city={jobDetails.city.name}
            companyName={jobDetails.company.name}
          />
          <JobSkills skills={jobDetails.skills} />
          <CompanyCard
            description={jobDetails.company.description ?? "Description"}
            industry={
              jobDetails.company.industry
                ? jobDetails.company.industry.name
                : "industry"
            }
            location={jobDetails.city.name}
            logoUrl={jobDetails.company.logo}
            name={jobDetails.company.name}
            size={
              jobDetails.company.companySize
                ? `${jobDetails.company.companySize.min_employees ?? "min"} ${
                    jobDetails.company.companySize.max_employees
                      ? jobDetails.company.companySize.max_employees > 100002
                        ? "+"
                        : `- ${jobDetails.company.companySize.max_employees}`
                      : "max"
                  } employees`
                : "Company Size"
            }
          />
        </div>
      </div>
    </div>
  );
}
