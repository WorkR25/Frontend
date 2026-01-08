"use client";

import { setShowAllCandidates } from "@/features/showAllCandidates/showAllCandidatesSlice";
import { RootState } from "@/lib/store.config";
import useGetUserListPagination from "@/utils/useGetUserListPaginated";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { useEffect, useState } from "react";
import TripleDotLoader from "../TripleDotLoader";
import { useDownloadCandidatesCsv } from "@/utils/useDownloadAllCandiidateCSV";

export default function AllCandidates() {
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const dispatch = useDispatch();

  const { data, isPending } = useGetUserListPagination(jwtToken, pageCount, 10);
  const { mutate: downloadCsv, isPending: downloadCsvPending } =
    useDownloadCandidatesCsv({ jwtToken });
  useEffect(() => {
    if (data) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  return (
    <div className="w-full h-full">
      <div
        className="components-createJob-CreateJobForm absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => {
          dispatch(setShowAllCandidates(false));
        }}
      >
        <X width={20} />
      </div>
      <div className="h-full flex flex-col justify-center ">
        <div className=" sm:flex justify-center mt-3 gap-5 md:gap-x-10 font-semibold text-lg text-center">
          <div className="py-1.5">
            All Candidates
            {` ( Total : ${data?.pagination.totalCount ?? "..."} ) `}
          </div>
          <button
            onClick={() => {
              downloadCsv();
            }}
            className="px-5 py-1.5 rounded-2xl bg-blue-300 text-sm md:text-base border-0 hover:cursor-pointer "
          >
            {downloadCsvPending ? "Downloading..." : "Download CSV"}
          </button>
        </div>
        <div className="overflow-y-scroll">
          {isPending && <TripleDotLoader />}
          {data &&
            data.records.map((user: GetUserResponseType) => (
              <div key={user.id} className="border rounded-lg p-4 m-4">
                <div>Name: {user.fullName}</div>
                <div>Email: {user.email}</div>
                <div>Phone: {user.phoneNo}</div>
                <div>
                  {"Graduation Year: "}
                  {user.graduationYear ?? "Not available"}
                </div>
              </div>
            ))}
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
    </div>
  );
}
