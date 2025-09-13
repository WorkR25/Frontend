"use client";

import { toogleShowJobApplicants } from "@/features/showJobApplicants/showJobApplicantsSlice";
import { RootState } from "@/lib/store.config";
import { cn } from "@/utils/cn";
import { ApplicantListType } from "@/utils/useGetJobApplicants";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ApplicantCard from "./ApplicantCard";
import useGetJobApplicantsPagination from "@/utils/useGetJobApplicantsPagination";
import { useEffect, useState } from "react";
import TripleDotLoader from "../TripleDotLoader";

export default function ViewApplicants({
  jobId,
  className,
}: {
  jobId: number;
  className?: string;
}) {
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });

  const { data, isPending } = useGetJobApplicantsPagination({
    jwtToken,
    jobId,
    limit: 10,
    page: pageCount,
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  return (
    <div
      className={cn(
        "component-viewApplicants-ViewApplicants justify-center ",
        className
      )}
    >
      <div
        className="component-viewApplicants-ViewApplicants absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(toogleShowJobApplicants());
        }}
      >
        <X width={20} />
      </div>
      <div className="component-viewApplicants-ViewApplicants w-full text-center m-3 mt-5 text-xl">
        Applicants {` ( Total : ${data?.pagination.totalCount ?? "..."} ) `}
      </div>
      {isPending && <TripleDotLoader />}
      {data && !data?.records?.length && (
        <div className="component-viewApplicants-ViewApplicants w-full text-center">
          No applicant
        </div>
      )}
      <div className="h-5/10 justify-center overflow-y-scroll ">
      {data?.records?.map((applicant: ApplicantListType) => {
        return (
          <div
          key={applicant.id}
          className="component-viewApplicants-ViewApplicants rounded m-3 "
          >
            <ApplicantCard
              resumeUrl={applicant.profile.resumeUrl}
              city={applicant.phoneNo}
              email={applicant.email}
              name={applicant.fullName}
            />
          </div>
        );
      })}
      </div>
      <div className="w-[100%] sticky bottom-0 bg-white border-t shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            className="flex items-center px-3 py-1 rounded-lg border disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
            disabled={pageCount === 1}
            onClick={() => {
              setPageCount((prev) => prev - 1);
            }}
          >
            <ChevronLeft size={16} className="mr-1" />
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {pageCount} of {totalPages == -1 ? "" : totalPages}
          </span>

          <button
            className="flex items-center px-3 py-1 rounded-lg border disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
            disabled={pageCount === totalPages}
            onClick={() => {
              setPageCount((prev) => prev + 1);
            }}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
