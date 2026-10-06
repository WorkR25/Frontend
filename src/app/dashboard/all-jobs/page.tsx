"use client";

import {
  ExternalLink,
  Laptop,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import ConfirmDeleteDialog from "@/components/ConfirmDelete";
import DashboardTopbarHamburgerMenu from "@/components/dashboard/DashboardTopbarHamburgerMenu";
import DashboardTopbarLogoutButton from "@/components/dashboard/DashboardTopbarLogoutButton";
import TodayDate from "@/components/dashboard/TodayDate";
import JobTabs from "@/components/exploreJobs/JobTabs";
import JobsPagination from "@/components/exploreJobs/JobsPagination";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setJobId } from "@/features/jobId/jobId";
import { setShowJobApplicants } from "@/features/showJobApplicants/showJobApplicantsSlice";
import { setShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { setShowJobupdateForm } from "@/features/showJobUpdateForm/showJobUpdateForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Job, JobListTab } from "@/types/GetJobType";
import { cn } from "@/utils/cn";
import { timeAgo } from "@/utils/getTime";
import { useDebounce } from "@/utils/useDebounce";
import useDeleteJob from "@/utils/useDeleteJob";
import useExploreJobs from "@/utils/useExploreJobs";
import useGetUser from "@/utils/useGetUser";
import useGetUserRoles from "@/utils/useGetUserRoles";

const PAGE_SIZE = 20;
const ALLOWED_ROLES: Record<string, boolean> = {
  admin: true,
  operations_admin: true,
};
const ROW_GRID = "lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto]";

function IconButton({
  label,
  onClick,
  children,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border transition-colors",
        tone === "danger"
          ? "border-[#F5D0CD] text-[#D92D20] hover:border-[#D92D20] hover:bg-[#FEF3F2]"
          : "border-[#E4E8F0] text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]",
      )}
    >
      {children}
    </button>
  );
}

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const [mounted, setMounted] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<JobListTab>("all");
  const [query, setQuery] = useState("");
  const company = useDebounce(query.trim(), 350);

  useEffect(() => setMounted(true), []);
  useEffect(() => setPage(1), [company, tab]);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) dispatch(setAuthJwtToken(token));
  }, [dispatch]);

  const { data: userData, isError } = useGetUser(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, userData?.id);
  const isAdmin = userRoles?.[0] === "admin";
  const allowed = !!userRoles && !!ALLOWED_ROLES[userRoles[0]];

  useEffect(() => {
    if (mounted && jwtToken.trim() === "") router.push("/login");
    if (isError) router.push("/login");
    if (userRoles && !ALLOWED_ROLES[userRoles[0]]) router.replace("/dashboard");
  }, [userRoles, router, isError, jwtToken, mounted]);

  const { data, isPending, isFetching } = useExploreJobs(
    jwtToken,
    { page, limit: PAGE_SIZE, company: company || undefined, tab, counts: true },
    allowed,
  );
  const { mutate: deleteJob, isPending: deleting } = useDeleteJob();

  if (!mounted) return null;
  if (!allowed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F4F6FA] font-plus-jakarta text-sm text-[#5B6478]">
        Checking your access…
      </div>
    );
  }

  const jobs = data?.records ?? [];
  const totalPages = data?.pagination.totalPages ?? 0;
  const total = data?.counts?.all ?? data?.pagination.totalCount;

  const openEdit = (job: Job) => {
    dispatch(setJobId(String(job.id)));
    dispatch(setShowJobupdateForm(true));
  };
  const openApplicants = (job: Job) => {
    dispatch(setJobId(String(job.id)));
    dispatch(setShowJobApplicants(true));
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F4F6FA] font-plus-jakarta text-[#0F172A]">
      <ConfirmDeleteDialog
        isOpen={!!jobToDelete}
        pending={deleting}
        onClose={() => setJobToDelete(null)}
        onConfirm={() => {
          if (!jobToDelete) return;
          deleteJob(
            { authJwtToken: jwtToken, deleteJobdata: { id: jobToDelete.id } },
            { onSettled: () => setJobToDelete(null) },
          );
        }}
        title="Delete this job?"
        confirmLabel="Delete job"
        message={
          jobToDelete && (
            <>
              <strong className="text-[#0F172A]">{jobToDelete.jobTitle.title}</strong> at{" "}
              <strong className="text-[#0F172A]">{jobToDelete.company.name}</strong> will be removed from WorkR.
              Candidates won’t see it any more. This can’t be undone.
            </>
          )
        }
      />

      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[15px] font-medium text-[#5B6478]">
            <Suspense fallback={null}>
              <DashboardTopbarHamburgerMenu />
            </Suspense>
            <span>
              Dashboard <span className="mx-1.5 text-[#A3ACBD]">/</span>{" "}
              <span className="font-semibold text-[#0F172A]">All jobs</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <TodayDate />
            <DashboardTopbarLogoutButton />
          </div>
        </header>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">Manage jobs</h1>
            <p className="mt-1 text-sm text-[#5B6478]">
              {total != null ? `${total.toLocaleString("en-IN")} live jobs` : "Live jobs"} · edit details, remove
              listings or see who applied.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setShowJobCreateForm(true))}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] hover:bg-[#1A3FAF]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
            Create job
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] border border-[#E4E8F0] bg-white p-4">
          <div className="flex h-12 items-center gap-3 rounded-xl border-[1.5px] border-[#E4E8F0] px-4 focus-within:border-[#2451D6] focus-within:ring-4 focus-within:ring-[#2451D6]/10">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#8A93A6]" aria-hidden="true" />
            <label htmlFor="admin-job-search" className="sr-only">
              Filter jobs by company
            </label>
            <input
              id="admin-job-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by company name…"
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-[#8A93A6]"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear filter"
                onClick={() => setQuery("")}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F1F4F9] text-[#344054]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.4} />
              </button>
            )}
          </div>
          <JobTabs active={tab} counts={data?.counts} onChange={setTab} />
        </div>

        <div className="flex flex-col gap-2.5">
          <div
            className={cn(
              "hidden gap-4 px-5 text-xs font-bold tracking-[0.08em] text-[#5B6478] lg:grid",
              ROW_GRID,
            )}
          >
            <span>JOB</span>
            <span>LOCATION</span>
            <span>TYPE</span>
            <span>POSTED</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {isPending ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl border border-[#E4E8F0] bg-white p-4">
                <div className="h-11 w-11 rounded-xl bg-[#EEF1F6]" />
                <div className="flex-1">
                  <div className="h-3.5 w-52 rounded bg-[#EEF1F6]" />
                  <div className="mt-2 h-3 w-24 rounded bg-[#EEF1F6]" />
                </div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#C9D2E3] bg-white px-6 py-14 text-center">
              <p className="text-base font-bold">{company ? `No jobs for “${company}”` : "No jobs here yet"}</p>
              <p className="text-sm text-[#5B6478]">Try another filter, or create a new job.</p>
            </div>
          ) : (
            <div className={cn("flex flex-col gap-2.5 transition-opacity", isFetching && "opacity-60")}>
              {jobs.map((job) => {
                const remote = job.is_remote ?? job.city?.trim().toLowerCase() === "remote";
                return (
                  <article
                    key={job.id}
                    className={cn(
                      "grid grid-cols-1 items-center gap-3 rounded-2xl border border-[#E4E8F0] bg-white p-4 transition-colors hover:border-[#C5D3F2] lg:gap-4 lg:px-5",
                      ROW_GRID,
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <CompanyLogo
                        name={job.company.name}
                        logo={job.company.logo}
                        className="h-11 w-11 rounded-xl border border-[#EEF1F6]"
                        textClassName="text-sm"
                        imagePadding="p-1.5"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[15px] font-bold">{job.jobTitle.title}</div>
                        <div className="truncate text-[13px] font-semibold text-[#5B6478]">
                          {job.company.name} <span className="font-normal text-[#A3ACBD]">· #{job.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#344054]">
                      {remote ? (
                        <>
                          <Laptop className="h-4 w-4 text-[#11643C]" aria-hidden="true" />
                          <span className="text-[#11643C]">Remote</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 text-[#8A93A6]" aria-hidden="true" />
                          <span className="truncate">{job.city}</span>
                        </>
                      )}
                    </div>

                    <div>
                      <span className="rounded-full bg-[#FFF4E0] px-2.5 py-1 text-xs font-bold text-[#8A4B00]">
                        {job.employmentType?.name}
                      </span>
                    </div>

                    <div className="text-sm text-[#5B6478]">{timeAgo(String(job.created_at))}</div>

                    <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => openApplicants(job)}
                          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#E4E8F0] px-3 text-[13px] font-bold text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]"
                        >
                          <Users className="h-4 w-4" aria-hidden="true" />
                          Applicants
                        </button>
                      )}
                      <IconButton label="Edit job" onClick={() => openEdit(job)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        title="Open job page"
                        aria-label="Open job page"
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4E8F0] text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <IconButton label="Delete job" tone="danger" onClick={() => setJobToDelete(job)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <JobsPagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
