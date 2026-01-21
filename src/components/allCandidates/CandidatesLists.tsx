import { GetUserResponseType } from "@/types/GetUserResponseType";
import TripleDotLoader from "../TripleDotLoader";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/store.config";
import { useSelector } from "react-redux";
import useGetUserListPagination from "@/utils/useGetUserListPaginated";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CandidatesListProps = {
  setTotalCount: React.Dispatch<React.SetStateAction<number | null>>;
};

export function FresherCandidatesList({
  setTotalCount,
}: CandidatesListProps) {
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);

  const { data, isPending } = useGetUserListPagination(jwtToken, pageCount, 10, "Fresher");
  useEffect(() => {
    if (data) {
      setTotalCount(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <div className="w-full h-9/10 overflow-y-scroll hide-scrollbar">
      <div className="">
        {isPending && <TripleDotLoader />}
        {data &&
          data.records.map((user: GetUserResponseType) => (
            <div key={user.id} className="border rounded-lg p-4 m-4">
              <div>Name: {user.fullName}</div>
              <div>Email: {user.email}</div>
              <div>Phone: {user.phoneNo}</div>
              <div>Domain: {user.profile.domain}</div>

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
  );
}

export function WorkingCandidatesList({
  setTotalCount,
}: CandidatesListProps) {
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);

  const { data, isPending } = useGetUserListPagination(jwtToken, pageCount, 10, "Working Professional");
  useEffect(() => {
    if (data) {
      setTotalCount(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <div className="w-full h-9/10 overflow-y-scroll hide-scrollbar">
      <div className="">
        {isPending && <TripleDotLoader />}
        {data &&
          data.records.map((user: GetUserResponseType) => (
            <div key={user.id} className="border rounded-lg p-4 m-4">
              <div>Name: {user.fullName}</div>
              <div>Email: {user.email}</div>
              <div>Phone: {user.phoneNo}</div>
              <div>Company: {user.profile.currentCompany}</div>
              <div>CTC: {user.profile.currentCtc}</div>
              <div>Domain: {user.profile.domain}</div>
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
  );
}
