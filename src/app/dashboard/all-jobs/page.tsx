"use client";

import ConfirmDeleteDialog from "@/components/ConfirmDelete";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import JobCard from "@/components/JobCard";
import { setJobId } from "@/features/jobId/jobId";
import { setShowJobupdateForm } from "@/features/showJobUpdateForm/showJobUpdateForm";
import useDeleteJob from "@/utils/useDeleteJob";
import useGetJobs from "@/utils/useGetJobs";
import useGetUser from "@/utils/useGetUser";
import useGetUserRoles from "@/utils/useGetUserRoles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [jwtToken, setJwtToken] = useState<string | null>("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setJwtToken(localStorage.getItem("AuthJwtToken"));
  }, []);

  const { data: userData } = useGetUser(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, userData?.id);
  const { data: jobList, isLoading: isLoadingJobList } = useGetJobs(jwtToken);

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
    <div className="text-black p-2 bg-[#FFFF] h-full pb-0 overflow-y-scroll py-3">
      <DashboardTopbar pageName="All Jobs" />
      <div className="sm:flex flex-wrap gap-2">
        {jobList?.map((job) => {
          return (
            <div
              className="w-full sm:w-[45%] flex h-fit border border-gray-100 rounded-lg p-2 hover:shadow-lg "
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
                className="w-[30vw] basis-4/5"
              />
              <div className="justify-center flex flex-col gap-2 px-2 basis-1/5">
                <button
                  onClick={() => {
                    dispatch(setJobId(String(job.id)));
                    dispatch(setShowJobupdateForm(true));
                  }}
                  className="border rounded-lg py-1 px-0.5 bg-[#32db97]"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(true);
                  }}
                  className="border rounded-lg py-1 px-0.5 bg-[#b83588]"
                >
                  Delete
                </button>
                <ConfirmDeleteDialog
                  isOpen={confirmDelete}
                  onClose={() => {
                    setConfirmDelete(false);
                  }}
                  onConfirm={() => {
                    mutate({
                      authJwtToken: jwtToken,
                      deleteJobdata: { id: job.id },
                    });
                    setConfirmDelete(false);
                  }}
                  message="Are you sure you want to delete this job posting ?"
                  title="Confirm delete ?"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
