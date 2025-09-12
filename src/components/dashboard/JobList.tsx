'use client';
import { RootState } from "@/lib/store.config";
// import useGetJobs from "@/utils/useGetJobs";
import { useSelector } from "react-redux";
import JobCard from "../JobCard";
import useGetJobPagination from "@/utils/useGetJobsPagination";
import TripleDotLoader from "../TripleDotLoader";

export default function JobList() {
  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });
  const page = useSelector((state: RootState)=>{ return state.jobPageNumber.value})
  const { data, isPending } = useGetJobPagination(jwtToken, page, 12) ;


  return (
    <div className="component-dashboard-JobList w-full flex flex-wrap items-stretch justify-center-safe my-2 mx gap-2 gap-y-3.5">
      {isPending && (
        <TripleDotLoader className="w-full h-full flex items-center justify-center" />
      )}
      {data?.map((job) => {
        return (
          <JobCard
            key={job.id}
            id={job.id}
            img={job.company.logo}
            title={job.jobTitle.title}
            company={job.company.name}
            employmentType={job.employmentType.name}
            city={job.city}
            country={job.country}
            minPay={job.salary_min}
            maxPay={job.salary_max}
            applyLink={job.apply_link}
            created_at={job.created_at}
            className="component-dashboard-JobList sm:w-[30%]"
          />
        );
      })}
    </div>
  );
}