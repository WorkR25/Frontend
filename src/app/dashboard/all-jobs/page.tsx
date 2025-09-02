"use client";

import ConfirmDeleteDialog from "@/components/ConfirmDelete";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import PaginationFooter from "@/components/dashboard/PaginationFooter";
import JobCard from "@/components/JobCard";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setJobId } from "@/features/jobId/jobId";
import { resetJobPageCount } from "@/features/jobPageNumber/jobPageNumberSlice";
import { setShowJobApplicants } from "@/features/showJobApplicants/showJobApplicantsSlice";
import { setShowJobupdateForm } from "@/features/showJobUpdateForm/showJobUpdateForm";
import { RootState } from "@/lib/store.config";
import useDeleteJob from "@/utils/useDeleteJob";
import useGetJobPagination from "@/utils/useGetJobsPagination";
import useGetUser from "@/utils/useGetUser";
import useGetUserRoles from "@/utils/useGetUserRoles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [jobIdToBeDeleted, setJobIdToBeDeleted] = useState<number>()
  const page = useSelector((state: RootState)=> state.jobPageNumber.value)

  useEffect(()=>{
    dispatch(resetJobPageCount())
  },[dispatch])

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if(token){
      dispatch(setAuthJwtToken(token))
    }else{
      router.replace("/login")
    }
  }, [dispatch, router]);

  
  const { data: userData } = useGetUser(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, userData?.id);
  const { data: jobList, isLoading: isLoadingJobList } = useGetJobPagination(jwtToken, page, 20);
  
  const { mutate } = useDeleteJob();
  
  useEffect(() => {
    if (userRoles && !userRoles?.includes("admin")) {
      router.replace("/dashboard");
    }
  }, [userRoles, router]);

  if (!userRoles || !userRoles.includes("admin")) {
    return <div className="flex justify-center w-full">Authorizing...</div>;
  }

  if (isLoadingJobList) {
    return (
      <div className="flex justify-center w-full">Loading All Jobs...</div>
    );
  }

  return (
    <div className="all-jobs-page absolute border top-0 text-black p-2 bg-[#FFFF] h-full pb-0 overflow-y-scroll py-3">
      <DashboardTopbar pageName="All Jobs" />
      <ConfirmDeleteDialog
                  isOpen={confirmDelete}
                  onClose={() => {
                    setConfirmDelete(false);
                  }}
                  onConfirm={() => {
                    if(jobIdToBeDeleted){
                      mutate({
                      authJwtToken: jwtToken,
                      deleteJobdata: { id: jobIdToBeDeleted},
                    });
                    }
                    setConfirmDelete(false);
                  }}
                  message="Are you sure you want to delete this job posting ?"
                  title="Confirm delete ?"
                />
      <div className="all-jobs-page sm:flex flex-wrap justify-around items-center gap-2">
        {jobList?.map((job) => {
          return (
            <div
              className="all-jobs-page w-full sm:w-[45%] h-fit border gap-y-3 flex flex-col items-center justify-center border-gray-100 rounded-lg p-2 hover:shadow-lg "
              key={job.id}
            >
              <JobCard
                id={job.id}
                img={job.companyId.logo}
                title={job.jobTitle.title}
                company={job.companyId.name}
                employmentType={job.is_remote ? "Remote" : "On-site"}
                city={job.city}
                country={job.country}
                minPay={job.salary_min}
                maxPay={job.salary_max}
                created_at={job.created_at}
                className="all-jobs-page w-[100%] "
              />
              <div className="all-jobs-page flex items-center justify-center gap-2 px-2 basis-1/5">
                <button
                  onClick={() => {
                    dispatch(setJobId(String(job.id)));
                    dispatch(setShowJobupdateForm(true));
                  }}
                  className="all-jobs-page border rounded-lg py-1 px-1.5 bg-[#32db97]"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(true);
                    setJobIdToBeDeleted(job.id);
                  }}
                  className="all-jobs-page border rounded-lg py-1 px-1.5 bg-[#b83588]"
                >
                  Delete
                </button>
                
                <button
                  onClick={() => {
                    dispatch(setShowJobApplicants(true));
                    dispatch(setJobId(String(job.id)))
                  }}
                  className="all-jobs-page border rounded-lg py-1 px-1.5 bg-[#32db97]"
                >
                  View applicants
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <PaginationFooter />
    </div>
  );
}
