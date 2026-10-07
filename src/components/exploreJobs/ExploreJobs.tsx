"use client";

import { Search, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import JobCard from "@/components/JobCard";
import DashboardTopbarHamburgerMenu from "@/components/dashboard/DashboardTopbarHamburgerMenu";
import DashboardTopbarLogoutButton from "@/components/dashboard/DashboardTopbarLogoutButton";
import TodayDate from "@/components/dashboard/TodayDate";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { HiringCompany, JOB_LIST_TABS, JobListTab } from "@/types/GetJobType";
import { useDebounce } from "@/utils/useDebounce";
import useExploreJobs from "@/utils/useExploreJobs";
import useGetHiringCompanies from "@/utils/useGetHiringCompanies";
import ExploreHero from "./ExploreHero";
import JobTabs, { JOB_TAB_LABELS } from "./JobTabs";
import JobsPagination from "./JobsPagination";

const PAGE_SIZE = 12;

function isJobListTab(value: string | null): value is JobListTab {
  return !!value && (JOB_LIST_TABS as readonly string[]).includes(value);
}

export default function ExploreJobs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) dispatch(setAuthJwtToken(token));
  }, [dispatch]);

  // ---- URL state: ?company=&companyId=&tab=&page= -------------------------
  const urlCompany = searchParams.get("company") ?? "";
  const urlCompanyId = Number(searchParams.get("companyId")) || undefined;
  const tabParam = searchParams.get("tab");
  const tab: JobListTab = isJobListTab(tabParam) ? tabParam : "all";
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const qs = next.toString();
      // Update the URL in place (Next.js syncs useSearchParams with the History API).
      // router.replace() would run a navigation, which moves focus out of the search box
      // mid-typing and drops the next keystrokes.
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, searchParams],
  );

  // ---- Search box ----------------------------------------------------------
  const [query, setQuery] = useState(urlCompany);
  const lastPushedCompany = useRef(urlCompany);

  // Follow URL changes made elsewhere (back button, "See all jobs at …" links).
  useEffect(() => {
    if (urlCompany !== lastPushedCompany.current) {
      lastPushedCompany.current = urlCompany;
      setQuery(urlCompany);
    }
  }, [urlCompany]);

  const commitCompany = useCallback(
    (company: string, companyId?: number) => {
      lastPushedCompany.current = company;
      updateParams({
        company: company || null,
        companyId: companyId ? String(companyId) : null,
        page: null,
      });
    },
    [updateParams],
  );

  // Live results while typing.
  const debouncedQuery = useDebounce(query.trim(), 350);
  useEffect(() => {
    if (debouncedQuery !== urlCompany) commitCompany(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const typed = query.trim();
  const suggestionQuery = useDebounce(typed, 200);
  const { data: suggestionData, isFetching: suggestionsFetching } = useGetHiringCompanies(
    suggestionQuery,
    6,
    suggestionQuery.length > 0,
  );
  // Only show results for real typed text: the "" key is the cached trending list.
  const suggestions = useMemo(
    () => (typed && suggestionQuery ? suggestionData ?? [] : []),
    [typed, suggestionQuery, suggestionData],
  );
  const suggestionsStale = !!typed && (suggestionQuery !== typed || suggestionsFetching);
  const { data: trending = [] } = useGetHiringCompanies("", 6);

  const pickCompany = (company: HiringCompany) => {
    setQuery(company.name);
    commitCompany(company.name, company.id);
  };

  const clearSearch = () => {
    setQuery("");
    commitCompany("");
  };

  const clearAll = () => {
    setQuery("");
    lastPushedCompany.current = "";
    window.history.replaceState(null, "", pathname);
  };

  // ---- Jobs ------------------------------------------------------------------
  const { data, isPending, isError, refetch, isFetching } = useExploreJobs(jwtToken, {
    page,
    limit: PAGE_SIZE,
    company: urlCompanyId ? undefined : urlCompany || undefined,
    companyId: urlCompanyId,
    tab,
    counts: true,
  });

  const jobs = useMemo(() => data?.records ?? [], [data]);
  const totalPages = data?.pagination.totalPages ?? 0;
  const totalCount = data?.pagination.totalCount ?? 0;

  // Out-of-range page (e.g. after a filter shrank the list) → go to last page.
  useEffect(() => {
    if (data && totalPages > 0 && page > totalPages) {
      updateParams({ page: String(totalPages) });
    }
  }, [data, page, totalPages, updateParams]);

  const goToPage = (nextPage: number) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : null });
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pickedCompany = urlCompanyId ? urlCompany : null;
  const pickedLogo = useMemo(() => {
    if (!pickedCompany) return null;
    return (
      [...suggestions, ...trending].find((c) => c.id === urlCompanyId)?.logo ??
      jobs.find((job) => job.company.id === urlCompanyId)?.company.logo ??
      null
    );
  }, [pickedCompany, suggestions, trending, jobs, urlCompanyId]);

  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  let resultsTitle = tab === "all" ? "Latest jobs" : JOB_TAB_LABELS[tab];
  let resultsSub =
    totalPages > 1 ? `Newest roles first · page ${page} of ${totalPages}` : "Newest roles first";
  if (data && pickedCompany) {
    resultsTitle = `${plural(totalCount, "open role", "open roles")} at ${pickedCompany}`;
    resultsSub = `Every job ${pickedCompany} has posted on WorkR, newest first`;
  } else if (data && urlCompany) {
    resultsTitle = `${plural(totalCount, "job", "jobs")} at companies matching “${urlCompany}”`;
    resultsSub = "Pick a company from the list to narrow it down";
  }
  const hasFilter = !!urlCompany || tab !== "all";

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto bg-[#F4F6FA] font-plus-jakarta text-[#0F172A]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[15px] font-medium text-[#5B6478]">
            <Suspense fallback={null}>
              <DashboardTopbarHamburgerMenu />
            </Suspense>
            <span>
              Dashboard <span className="mx-1.5 text-[#A3ACBD]">/</span>{" "}
              <span className="font-semibold text-[#0F172A]">Explore jobs</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <TodayDate />
            <DashboardTopbarLogoutButton />
          </div>
        </header>

        <ExploreHero
          query={query}
          onQueryChange={setQuery}
          onSubmit={() => commitCompany(query.trim())}
          onClear={clearSearch}
          onPickCompany={pickCompany}
          suggestions={suggestions}
          suggestionsStale={suggestionsStale}
          suggestionsEnabled={!(pickedCompany && query.trim() === pickedCompany)}
          trending={trending}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <JobTabs
            active={tab}
            counts={data?.counts}
            onChange={(next) => updateParams({ tab: next === "all" ? null : next, page: null })}
          />
          <div className="flex h-10 items-center gap-1.5 rounded-full border border-[#E4E8F0] bg-white px-3.5 text-sm text-[#5B6478]">
            Sort by <strong className="text-[#0F172A]">Newest</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {pickedCompany && (
              <CompanyLogo
                name={pickedCompany}
                logo={pickedLogo}
                className="h-11 w-11 rounded-xl border border-[#E4E8F0]"
                textClassName="text-sm"
                imagePadding="p-1.5"
              />
            )}
            <div className="min-w-0">
              <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">{resultsTitle}</h2>
              <p className="mt-0.5 text-sm text-[#5B6478]">{resultsSub}</p>
            </div>
          </div>
          {hasFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="flex h-[38px] cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E8F0] bg-white px-3.5 text-sm font-semibold text-[#2451D6] hover:border-[#2451D6]"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        {isError && !data ? (
          <div className="flex flex-col items-center gap-3 rounded-[20px] border border-[#E4E8F0] bg-white px-6 py-14 text-center">
            <p className="text-lg font-bold">We couldn’t load jobs right now.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="h-11 cursor-pointer rounded-xl bg-[#2451D6] px-5 text-[15px] font-bold text-white hover:bg-[#1A3FAF]"
            >
              Try again
            </button>
          </div>
        ) : isPending ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[230px] animate-pulse rounded-[20px] border border-[#E4E8F0] bg-white p-[22px]">
                <div className="h-[52px] w-[52px] rounded-2xl bg-[#EEF1F6]" />
                <div className="mt-5 h-4 w-3/4 rounded bg-[#EEF1F6]" />
                <div className="mt-2 h-3 w-1/3 rounded bg-[#EEF1F6]" />
                <div className="mt-5 flex gap-2">
                  <div className="h-7 w-20 rounded-lg bg-[#EEF1F6]" />
                  <div className="h-7 w-16 rounded-lg bg-[#EEF1F6]" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-[20px] border border-dashed border-[#C9D2E3] bg-white px-6 py-16 text-center">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px] bg-[#EAF0FD] text-[#2451D6]">
              <Search className="h-[26px] w-[26px]" aria-hidden="true" />
            </div>
            <p className="text-lg font-bold">
              {urlCompany ? `No jobs found for “${urlCompany}”` : "No jobs match this filter yet"}
            </p>
            <p className="max-w-[380px] text-sm text-[#5B6478]">
              {urlCompany
                ? "Check the spelling, or try one of the trending companies above."
                : "Try another filter, or check back soon — new roles are added every day."}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-1.5 h-11 cursor-pointer rounded-xl bg-[#2451D6] px-5 text-[15px] font-bold text-white hover:bg-[#1A3FAF]"
            >
              Show all jobs
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 transition-opacity ${isFetching ? "opacity-70" : ""}`}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                img={job.company.logo}
                title={job.jobTitle.title}
                company={job.company.name}
                employmentType={job.employmentType?.name}
                city={job.city}
                country={job.country}
                minPay={job.salary_min}
                maxPay={job.salary_max}
                applyLink={job.apply_link}
                created_at={job.created_at}
                skills={job.skills}
                isRemote={job.is_remote}
              />
            ))}
          </div>
        )}

        <JobsPagination page={page} totalPages={totalPages} onChange={goToPage} />
      </div>
    </div>
  );
}
