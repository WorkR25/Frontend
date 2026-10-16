"use client";

import { ArrowDown, ArrowUp, Briefcase, Download, GraduationCap, Loader2, Minus, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import JobsPagination from "@/components/exploreJobs/JobsPagination";
import FormModal from "@/components/ui/FormModal";
import { setShowAllCandidates } from "@/features/showAllCandidates/showAllCandidatesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { useDownloadCandidatesCsv } from "@/utils/useDownloadAllCandiidateCSV";
import useGetUserListPagination from "@/utils/useGetUserListPaginated";
import useSignupsByDay from "@/utils/useSignupsByDay";
import {
  CandidateRow,
  CandidateRowSkeleton,
  CandidatesEmpty,
  CandidateTableHeader,
  CandidateType,
} from "./CandidatesLists";
import CandidatesViewSwitch, { CandidatesView } from "./CandidatesViewSwitch";
import NurtureLeadsModal from "./NurtureLeadsModal";
import SignupDayStrip, { ALL_TIME, DaySelection, dayName, formatDayLong, istTodayKey } from "./SignupDayStrip";

const PAGE_SIZE = 20;

const TABS: { type: CandidateType; label: string; icon: React.ReactNode }[] = [
  { type: "Student", label: "Students", icon: <GraduationCap className="h-4 w-4" aria-hidden="true" /> },
  { type: "Working Professional", label: "Working professionals", icon: <Briefcase className="h-4 w-4" aria-hidden="true" /> },
];

const formatCount = (n?: number) => (n == null ? "…" : n.toLocaleString("en-IN"));

function SignupsModal({ view, onViewChange }: { view: CandidatesView; onViewChange: (view: CandidatesView) => void }) {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const [type, setType] = useState<CandidateType>("Student");
  // The list opens on today's sign-ups; "All time" shows everyone, any other day shows just that day.
  const [selected, setSelected] = useState<DaySelection>(istTodayKey);
  const [daysBack, setDaysBack] = useState(30);
  const date = selected === ALL_TIME ? undefined : selected;
  const [pages, setPages] = useState<Record<string, number>>({});
  const pageKey = `${selected}|${type}`;
  const page = pages[pageKey] ?? 1;
  const listTopRef = useRef<HTMLDivElement>(null);

  const daily = useSignupsByDay(jwtToken, daysBack);
  const dayList = daily.data?.days;
  const today = dayList?.[0]?.date ?? istTodayKey();

  const { data, isPending, isError, isFetching, refetch } = useGetUserListPagination(jwtToken, page, PAGE_SIZE, type, date);
  // Light requests just for the tab counts.
  const { data: studentCount } = useGetUserListPagination(jwtToken, 1, 1, "Student", date);
  const { data: workingCount } = useGetUserListPagination(jwtToken, 1, 1, "Working Professional", date);
  const counts: Record<CandidateType, number | undefined> = {
    Student: studentCount?.pagination?.totalCount,
    "Working Professional": workingCount?.pagination?.totalCount,
  };

  const { mutate: downloadCsv, isPending: downloading } = useDownloadCandidatesCsv({ jwtToken, details: type, date });

  const close = useCallback(() => dispatch(setShowAllCandidates(false)), [dispatch]);

  const totalPages: number = data?.pagination?.totalPages ?? 0;
  const records: GetUserResponseType[] = data?.records ?? [];
  const totalAll = (counts.Student ?? 0) + (counts["Working Professional"] ?? 0);

  useEffect(() => {
    listTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [page, type, selected]);

  // How the chosen day compares with the day before it (both are in the daily list) and with the last 7 days.
  const dayIndex = dayList?.findIndex((d) => d.date === selected) ?? -1;
  const dayTotal = dayIndex >= 0 ? dayList![dayIndex].total : undefined;
  const previousTotal = dayIndex >= 0 && dayIndex + 1 < dayList!.length ? dayList![dayIndex + 1].total : undefined;
  const delta = dayTotal != null && previousTotal != null ? dayTotal - previousTotal : undefined;
  const last7 = dayList?.slice(0, 7);
  const average7 = last7 && last7.length ? last7.reduce((sum, d) => sum + d.total, 0) / last7.length : undefined;
  const relative = date ? dayName(date, today) : undefined; // "Today", "Yesterday", or "Wed, 14 Oct"
  const dayLabel = date
    ? relative === "Today" || relative === "Yesterday"
      ? `${relative} · ${formatDayLong(date)}`
      : formatDayLong(date)
    : "All time";
  const dayWord = date ? (relative === "Today" ? "today" : relative === "Yesterday" ? "yesterday" : `on ${formatDayLong(date)}`) : undefined;

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, data?.pagination?.totalCount ?? 0);

  return (
    <FormModal
      title="All candidates"
      subtitle="Track who signed up on WorkR, day by day."
      icon={<Users className="h-[22px] w-[22px]" aria-hidden="true" />}
      iconTone="bg-[#F1EDFF] text-[#5B3CC4]"
      onClose={close}
      widthClassName="sm:max-w-[1240px] sm:h-[92vh]"
      footer={
        totalPages > 1 ? (
          <JobsPagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPages((prev) => ({ ...prev, [pageKey]: p }))}
          />
        ) : (
          <div className="text-[13px] text-[#5B6478]">
            Showing all {type === "Student" ? "students" : "working professionals"}
            {dayWord ? ` who signed up ${dayWord}` : ""}
          </div>
        )
      }
    >
      <div ref={listTopRef} className="scroll-mt-6" />
      <CandidatesViewSwitch view={view} onChange={onViewChange} />
      <SignupDayStrip
        days={dayList}
        loading={daily.isPending}
        error={daily.isError}
        onRetry={() => daily.refetch()}
        selected={selected}
        onSelect={setSelected}
        today={today}
        canLoadOlder={daysBack < 365 && !!dayList && dayList.length >= daysBack}
        loadingOlder={daily.isFetching && !daily.isPending && daily.isPlaceholderData}
        onLoadOlder={() => setDaysBack((n) => Math.min(365, n + 30))}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-[#E4E8F0] bg-white px-5 py-4">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#5B6478]">{dayLabel}</div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[30px] font-extrabold leading-none tracking-[-0.02em]" aria-live="polite">
              {counts.Student != null && counts["Working Professional"] != null ? totalAll.toLocaleString("en-IN") : "…"}
            </span>
            <span className="text-sm font-semibold text-[#344054]">{date ? "sign-ups" : "job seekers signed up so far"}</span>
            <span className="text-[13px] text-[#5B6478]">
              {formatCount(counts.Student)} students · {formatCount(counts["Working Professional"])} working professionals
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {delta != null && (
            <span
              className={cn(
                "flex h-8 items-center gap-1 rounded-full px-3 text-[13px] font-bold",
                delta > 0 ? "bg-[#E3F6EC] text-[#11643C]" : delta < 0 ? "bg-[#FFF1DB] text-[#8A4B00]" : "bg-[#F1F4F9] text-[#5B6478]",
              )}
              title="Compared with the previous day"
            >
              {delta > 0 ? <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> : delta < 0 ? <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /> : <Minus className="h-3.5 w-3.5" aria-hidden="true" />}
              {delta === 0 ? "Same as the day before" : `${Math.abs(delta)} ${delta > 0 ? "more" : "fewer"} than the day before`}
            </span>
          )}
          {average7 != null && (
            <span className="flex h-8 items-center rounded-full bg-[#F1F4F9] px-3 text-[13px] font-semibold text-[#344054]" title="Average over the last 7 days, including today">
              7-day average: <strong className="ml-1 text-[#0F172A]">{average7.toLocaleString("en-IN", { maximumFractionDigits: 1 })}</strong>/day
            </span>
          )}
        </div>
      </div>

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

      <CandidateTableHeader type={type} showNurture={type === "Working Professional"} showApplied />

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
        <CandidatesEmpty type={type} dayLabel={dayWord} />
      ) : (
        <div className={cn("flex flex-col gap-2.5 transition-opacity", isFetching && "opacity-60")}>
          {records.map((user) => (
            <CandidateRow key={user.id} user={user} type={type} showNurture={type === "Working Professional"} showApplied />
          ))}
        </div>
      )}
    </FormModal>
  );
}

/** The All candidates pop-up: sign-ups by day, or the working professionals in the nurture sequence. */
export default function AllCandidates() {
  const [view, setView] = useState<CandidatesView>("signups");
  return view === "signups" ? (
    <SignupsModal view={view} onViewChange={setView} />
  ) : (
    <NurtureLeadsModal view={view} onViewChange={setView} />
  );
}
