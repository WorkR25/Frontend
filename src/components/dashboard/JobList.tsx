'use client';
import { RootState } from "@/lib/store.config";
import useGetJobs from "@/utils/useGetJobs";
import { useSelector } from "react-redux";
import JobCard from "../JobCard";

export default function JobList() {
  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });
  const { data } = useGetJobs(jwtToken);
  return (
    <div className="flex flex-wrap items-center justify-center-safe my-2 mx-auto gap-2 gap-y-3.5">
      {data?.map((job) => {
        return (
          <JobCard
            key={job.id}
            id={job.id}
            img={job.companyId.logo}
            title={job.jobTitle.title}
            company={job.companyId.name}
            employmentType={job.is_remote ? "Remote" : "On-site"}
            city={job.city}
            country={job.country}
            minPay={job.salary_min}
            maxPay={job.salary_max}
            applyLink={job.apply_link}
            className="sm:w-[30%]"
          />
        );
      })}
    </div>
  );
}