"use client";

import { setShowAllCandidates } from "@/features/showAllCandidates/showAllCandidatesSlice";
import { useDownloadCandidatesCsv } from "@/utils/useDownloadAllCandiidateCSV";
import {
  StudentCandidatesList,
  WorkingCandidatesList,
} from "./CandidatesLists";
import { JSX, useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function AllCandidates() {
  const [candidateType, setCandidateType] = useState("Student");
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const dispatch = useAppDispatch();
  const { mutate: downloadCsv, isPending: downloadCsvPending } =
    useDownloadCandidatesCsv({ jwtToken, details: candidateType });

  const CandidateTypesMap: { [key: string]: JSX.Element } = {
    Student: <StudentCandidatesList setTotalCount={setTotalCount} />,
    "Working Professional": (
      <WorkingCandidatesList setTotalCount={setTotalCount} />
    ),
  };
  return (
    <div className="fixed z-50 w-full h-full font-inter flex items-center justify-center bg-[#0F172A]/20 backdrop-blur-[10px] ">
      <div className="w-full  sm:w-9/10 h-full sm:h-9/10 bg-white sm:rounded-[28px] bg-[radial-gradient(120%_130%_at_100%_50%,rgba(255,255,255,0)_64%,rgba(178,214,244,0.55)_80%,rgba(164,206,241,0.70)_94%,rgba(152,198,236,0.84)_100%)] shadow-2xl">
        <div className="h-full flex flex-col ">
          <div className="sm:flex items-center justify-between px-7 mt-5 my-1 gap-5 md:gap-x-10 font-semibold text-lg text-center">
            <div className="py-1.5">
              <span className="text-2xl font-semibold">All Candidates</span>
              <span className="text-xl font-normal">
                {` ( Total : ${totalCount ?? "..."} ) `}
              </span>
            </div>

            <div className="flex items-center  gap-x-5">
              <button
                onClick={() => {
                  downloadCsv();
                }}
                className="px-6  py-1.5 h-14  text-center flex items-center 
                justify-center gap-x-2 rounded-2xl cursor-pointer border border-[#2D6BFF] 
                bg-[linear-gradient(90deg,#2E63F5_0%,#3478FF_60%,#285BEB_100%)] 
                shadow-[0_12px_24px_rgba(46,99,245,0.28)] hover:brightness-105 
                active:translate-y-[1px] text-lg font-medium text-white transition"
              >
                {downloadCsvPending
                  ? "Downloading..."
                  : "Download CSV (" + candidateType.split(" ")[0] + ")"}
              </button>
              <div
                className="components-createJob-CreateJobForm hover:cursor-pointer "
                onClick={() => {
                  dispatch(setShowAllCandidates(false));
                }}
              >
                <X width={20} />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 border border-gray-200 overflow-hidden w-full sm:w-1/3  my-1.5 font-light rounded-xl bg-white h-10">
              <div
                onClick={() => {
                  setCandidateType("Student");
                }}
                className={
                  (candidateType === "Student"
                    ? `bg-[linear-gradient(90deg,#2E63F5_0%,#3478FF_60%,#285BEB_100%)] 
                        shadow-[0_12px_24px_rgba(46,99,245,0.28)] hover:brightness-105 
                        active:translate-y-[1px] text-lg font-medium text-white transition`
                    : " text-black ") +
                  " rounded-lg py-0.5 hover:cursor-pointer font-medium flex items-center justify-center"
                }
              >
                <div>Student</div>
              </div>
              <div
                onClick={() => {
                  setCandidateType("Working Professional");
                }}
                className={
                  (candidateType === "Working Professional"
                    ? `bg-[linear-gradient(90deg,#2E63F5_0%,#3478FF_60%,#285BEB_100%)] 
                        shadow-[0_12px_24px_rgba(46,99,245,0.28)] hover:brightness-105 
                        active:translate-y-[1px] text-lg font-medium text-white transition`
                    : " text-black ") +
                  " rounded-lg py-0.5 hover:cursor-pointer font-medium flex items-center justify-center"
                }
              >
                <div>Working</div>
              </div>
            </div>
          </div>
          {/* candidate list */}
          {CandidateTypesMap[candidateType]}
          <div className="hidden border border-red-600"></div>
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
    </div>
  );
}
