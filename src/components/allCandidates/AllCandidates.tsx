"use client";

import { setShowAllCandidates } from "@/features/showAllCandidates/showAllCandidatesSlice";
import { RootState } from "@/lib/store.config";
import { useDispatch, useSelector } from "react-redux";
import { useDownloadCandidatesCsv } from "@/utils/useDownloadAllCandiidateCSV";
import { StudentCandidatesList, WorkingCandidatesList } from "./CandidatesLists";
import { JSX, useState } from "react";
import { X } from "lucide-react";

export default function AllCandidates() {
  const [candidateType, setCandidateType] = useState("Student");
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const dispatch = useDispatch();
  const { mutate: downloadCsv, isPending: downloadCsvPending } =
    useDownloadCandidatesCsv({ jwtToken, details: candidateType });

  const CandidateTypesMap: { [key: string]: JSX.Element } = {
    Student: <StudentCandidatesList setTotalCount={setTotalCount} />,
    "Working Professional": (
      <WorkingCandidatesList setTotalCount={setTotalCount} />
    ),
  };
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
        <div className=" sm:flex justify-center mt-3 my-1 gap-5 md:gap-x-10 font-semibold text-lg text-center">
          <div className="py-1.5">
            All Candidates
            {` ( Total : ${totalCount ?? "..."} ) `}
          </div>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 w-full sm:w-1/2 py-1 my-1.5 font-light rounded-xl bg-white h-10">
              <div onClick={()=>{setCandidateType("Student")}} className={(candidateType === "Student" ? "bg-blue-300" : "" )+ " rounded-lg py-0.5 hover:cursor-pointer flex items-center justify-center"}><div>Student</div></div>
              <div onClick={()=>{setCandidateType("Working Professional")}} className={(candidateType === "Working Professional" ? "bg-blue-300" : "" )+ " rounded-lg py-0.5 hover:cursor-pointer flex items-center justify-center"}><div>Working</div></div>
            </div>
          </div>
          <button
            onClick={() => {
              downloadCsv();
            }}
            className="px-5 py-1.5 rounded-2xl bg-blue-300 text-sm md:text-base border-0 hover:cursor-pointer "
          >
            {downloadCsvPending ? "Downloading..." : ("Download CSV (" + candidateType.split(" ")[0]+ ")")}
          </button>
        </div>
        {/* candidate list */}
        {CandidateTypesMap[candidateType]}
        {/* <div className="overflow-y-scroll">
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
        </div> */}

        {/* pagination */}
      </div>
    </div>
  );
}
