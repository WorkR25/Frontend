"use client";

import { Download, GraduationCap, Loader2, Users, Briefcase } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import JobsPagination from "@/components/exploreJobs/JobsPagination";
import FormModal from "@/components/ui/FormModal";
import { setShowAllCandidates } from "@/features/showAllCandidates/showAllCandidatesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { useDownloadCandidatesCsv } from "@/utils/useDownloadAllCandiidateCSV";
import useGetUserListPagination from "@/utils/useGetUserListPaginated";
import {
  CandidateRow,
  CandidateRowSkeleton,
  CandidatesEmpty,
  CandidateTableHeader,
  CandidateType,
} from "./CandidatesLists";

const PAGE_SIZE = 20;

const TABS: { type: CandidateType; label: string; icon: React.ReactNode }[] = [
  { type: "Student", label: "Students", icon: <GraduationCap className="h-4 w-4" aria-hidden="true" /> },
  { type: "Working Professional", label: "Working professionals", icon: <Briefcase className="h-4 w-4" aria-hidden="true" /> },
];

const formatCount = (n?: number) => (n == null ? "…" : n.toLocaleString("en-IN"));

export default function AllCandidates() {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const [type, setType] = useState<CandidateType>("Student");
  const [pages, setPages] = useState<Record<CandidateType, number>>({
    Student: 1,
    "Working Professional": 1,
  });
  const page = pages[type];
  const listTopRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError, isFetching, refetch } = useGetUserListPagination(jwtToken, page, PAGE_SIZE, type);
  // Light requests just for the tab counts.
  const { data: studentCount } = useGetUserListPagination(jwtToken, 1, 1, "Student");
  const { data: workingCount } = useGetUserListPagination(jwtToken, 1, 1, "Working Professional");
  const counts: Record<CandidateType, number | undefined> = {
    Student: studentCount?.pagination?.totalCount,
    "Working Professional": workingCount?.pagination?.totalCount,
  };

  const { mutate: downloadCsv, isPending: downloading } = useDownloadCandidatesCsv({ jwtToken, details: type });

  const close = useCallback(() => dispatch(setShowAllCandidates(false)), [dispatch]);

  const totalPages: number = data?.pagination?.totalPages ?? 0;
  const records: GetUserResponseType[] = data?.records ?? [];
  const totalAll = (counts.Student ?? 0) + (counts["Working Professional"] ?? 0);

  useEffect(() => {
    listTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [page, type]);

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, data?.pagination?.totalCount ?? 0);

  return (
    <FormModal
      title="All candidates"
      subtitle={
        counts.Student != null && counts["Working Professional"] != null
          ? `${totalAll.toLocaleString("en-IN")} job seekers have signed up on WorkR.`
          : "Everyone who has signed up as a job seeker."
      }
      icon={<Users className="h-[22px] w-[22px]" aria-hidden="true" />}
      iconTone="bg-[#F1EDFF] text-[#5B3CC4]"
      onClose={close}
      widthClassName="sm:max-w-[1240px] sm:h-[92vh]"
      footer={
        totalPages > 1 ? (
          <JobsPagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPages((prev) => ({ ...prev, [type]: p }))}
          />
        ) : (
          <div className="text-[13px] text-[#5B6478]">Showing all {type === "Student" ? "students" : "working professionals"}</div>
        )
      }
    >
      <div ref={listTopRef} className="scroll-mt-6" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Candidate type" className="flex flex-wrap gap-1 rounded-2xl border border-[#E4E8F0] bg-white p-1">
          {TABS.map((tab) => {
            const active = tab.type === type;
            return (
              <button
                key={tab.type}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setType(tab.type)}
                className={cn(
                  "flex h-10 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm transition-colors",
                  active ? "bg-[#142463] font-bold text-white" : "font-semibold text-[#344054] hover:bg-[#F4F6FA]",
                )}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={cn(
                    "min-w-[28px] rounded-full px-2 py-0.5 text-center text-xs",
                    active ? "bg-white/20" : "bg-[#F1F4F9] text-[#5B6478]",
                  )}
                >
                  {formatCount(counts[tab.type])}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {data && records.length > 0 && (
            <span className="hidden text-[13px] text-[#5B6478] sm:inline">
              Showing <strong className="text-[#0F172A]">{from}–{to}</strong> of{" "}
              {formatCount(data.pagination?.totalCount)}
            </span>
          )}
          <button
            type="button"
            onClick={() => downloadCsv()}
            disabled={downloading}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-[#B9CBF3] bg-white px-4 text-sm font-bold text-[#2451D6] transition-colors hover:border-[#2451D6] disabled:cursor-wait disabled:opacity-70"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
            {downloading ? "Preparing CSV…" : `Download CSV · ${type === "Student" ? "Students" : "Working"}`}
          </button>
        </div>
      </div>

      <CandidateTableHeader type={type} />

      {isError && !data ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E8F0] bg-white px-6 py-12 text-center">
          <p className="text-base font-bold">We couldn’t load candidates.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="h-10 cursor-pointer rounded-xl bg-[#2451D6] px-4 text-sm font-bold text-white hover:bg-[#1A3FAF]"
          >
            Try again
          </button>
        </div>
      ) : isPending ? (
        <div className="flex flex-col gap-2.5" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <CandidateRowSkeleton key={i} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <CandidatesEmpty type={type} />
      ) : (
        <div className={cn("flex flex-col gap-2.5 transition-opacity", isFetching && "opacity-60")}>
          {records.map((user) => (
            <CandidateRow key={user.id} user={user} type={type} />
          ))}
        </div>
      )}
    </FormModal>
  );
}
