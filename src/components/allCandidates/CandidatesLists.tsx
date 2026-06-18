import { GetUserResponseType } from "@/types/GetUserResponseType";
import TripleDotLoader from "../TripleDotLoader";
import { useEffect, useState } from "react";
import useGetUserListPagination from "@/utils/useGetUserListPaginated";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

type CandidatesListProps = {
  setTotalCount: React.Dispatch<React.SetStateAction<number | null>>;
};

export function StudentCandidatesList({ setTotalCount }: CandidatesListProps) {
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const { data, isPending } = useGetUserListPagination(
    jwtToken,
    pageCount,
    10,
    "Student",
  );
  useEffect(() => {
    if (data) {
      setTotalCount(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <div className="w-full flex flex-col rounded-b-2xl  h-9/10 overflow-y-scroll hide-scrollbar">
      <div className="flex-1 h-full min-h-0  p-4 pb-0 rounded-2xl mx-2">
        <div className=" rounded-2xl h-full min-h-0 p-3 bg-linear-to-r from-[#d2e7f9] to-white">
          {isPending && <TripleDotLoader />}
          {data && data.records.length > 0 ? (
            <div className="w-full rounded-2xl overflow-hidden h-full min-h-0  ">
              {/* Header */}
              <div className="grid grid-cols-3 h-14 text-xl font-semibold text-gray-800 tracking-wide items-center bg-gray-100/90 px-2">
                <div className="px-4 h-full flex items-center border-r border-gray-200 font-medium">
                  Name & Phone
                </div>
                <div className="px-4 h-full flex items-center border-r border-gray-200 font-medium">
                  Email
                </div>
                <div className="px-4 h-full flex items-center font-medium">
                  Domain & Graduation Year
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2 py-2 px-2 bg-gray-50 h-full min-h-0 max-h-[calc(100%-3.5rem)] overflow-y-auto">
                {data.records.map((user: GetUserResponseType) => (
                  <div
                    key={user?.id ?? ""}
                    className="grid grid-cols-3 text-lg text-gray-700 tracking-wide font-medium bg-white rounded-xl shadow-sm hover:bg-gray-50"
                  >
                    <div className="px-4 py-3 border-r border-gray-300">
                      <div>{user?.fullName}</div>
                      <div className="flex items-center gap-x-2">
                        <Phone size={14} />
                        <div className="text-sm text-gray-500">
                          {user?.phoneNo}
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 border-r border-gray-300">
                      {user?.email}
                    </div>

                    <div className="px-4 py-3">
                      <div>{user?.profile?.domain ?? ""}</div>
                      <div className="text-sm text-gray-500">
                        {user.graduationYear ?? "Not available"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No records found</div>
          )}
        </div>
      </div>
      <div className="w-[100%]  bg-white text-black shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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

export function WorkingCandidatesList({ setTotalCount }: CandidatesListProps) {
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const { data, isPending } = useGetUserListPagination(
    jwtToken,
    pageCount,
    10,
    "Working Professional",
  );
  useEffect(() => {
    if (data) {
      setTotalCount(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <div className="w-full flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 p-4 pb-0">
        <div className="h-full min-h-0 rounded-2xl p-3 bg-linear-to-r from-[#d2e7f9] to-white">
          {isPending && <TripleDotLoader />}
          {data && data.records.length > 0 ? (
            <div className="w-full h-full min-h-0 flex flex-col rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 h-14 items-center bg-gray-100/90 px-2 flex-shrink-0">
                <div className="px-4 h-full flex items-center border-r border-gray-200 font-medium">
                  Name & Phone
                </div>
                <div className="px-4 h-full flex items-center border-r border-gray-200 font-medium">
                  Email & Domain
                </div>
                <div className="px-4 h-full flex items-center font-medium">
                  Company & CTC
                </div>
              </div>

              <div className="flex-1 min-h-0 h-full max-h-[calc(100%-3.5rem)]  overflow-y-auto flex flex-col gap-2 py-2 px-2 bg-gray-50 hide-scrollbar">
                {data.records.map((user: GetUserResponseType) => (
                  <div
                    key={user?.id ?? ""}
                    className="grid grid-cols-3 bg-white rounded-xl shadow-sm hover:bg-gray-50"
                  >
                    <div className="px-4 py-3 border-r border-gray-300">
                      <div>{user?.fullName}</div>
                      <div className="flex items-center gap-x-2">
                        <Phone size={14} />
                        <div className="text-sm text-gray-500">
                          {user?.phoneNo}
                        </div>
                      </div>
                    </div>

                    {/* Email + Domain */}
                    <div className="px-4 py-3 border-r border-gray-300">
                      <div>{user?.email}</div>
                      <div className="text-sm text-gray-500">
                        {user?.profile?.domain ?? ""}
                      </div>
                    </div>

                    {/* Company + CTC */}
                    <div className="px-4 py-3">
                      <div>{user?.profile?.currentCompany ?? "N/A"}</div>
                      <div className="text-sm text-gray-500">
                        {user?.profile?.currentCtc ?? "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              No records found
            </div>
          )}
        </div>
      </div>

      {/* Pagination (fixed at bottom) */}
      <div className="w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            className="flex items-center px-3 py-1 rounded-lg border disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
            disabled={pageCount === 1}
            onClick={() => setPageCount((prev) => prev - 1)}
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
            onClick={() => setPageCount((prev) => prev + 1)}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
