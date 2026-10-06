"use client";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { Suspense, use, useEffect } from "react";
import TripleDotLoader from "@/components/TripleDotLoader";
import DashboardTopbarHamburgerMenu from "@/components/dashboard/DashboardTopbarHamburgerMenu";
import DashboardTopbarLogoutButton from "@/components/dashboard/DashboardTopbarLogoutButton";
import TodayDate from "@/components/dashboard/TodayDate";
import ApplyCta from "@/components/jobDetails/ApplyCta";
import CompanyCard from "@/components/jobDetails/CompanyCard";
import { companyJobsHref } from "@/components/jobDetails/companyJobsHref";
import JobDescription from "@/components/jobDetails/JobDescription";
import JobDetailsCard from "@/components/jobDetails/JobDetailsCard";
import JobSkills from "@/components/jobDetails/JobSkills";
import MoreJobsAtCompany from "@/components/jobDetails/MoreJobsAtCompany";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setJobDetails } from "@/features/jobDetails/jobDetails";
import { setJobId } from "@/features/jobId/jobId";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { JobDetails } from "@/types/JobDetailsType";
import useGetJobDetails from "@/utils/useGetJobDetails";

function formatCompanySize(companySize: JobDetails["company"]["companySize"] | null | undefined) {
  if (!companySize) return "—";
  const { min_employees: min, max_employees: max } = companySize;
  const fmt = (n: number) => n.toLocaleString("en-IN");
  if (min != null && (max == null || max > 100002)) return `${fmt(min)}+ employees`;
  if (min != null && max != null) return `${fmt(min)}–${fmt(max)} employees`;
  return "—";
}

export default function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) dispatch(setAuthJwtToken(token));
  }, [dispatch]);

  const { data: job, isPending, isError } = useGetJobDetails(jwtToken, jobId);

  useEffect(() => {
    dispatch(setJobId(jobId));
  }, [dispatch, jobId]);

  useEffect(() => {
    if (job) dispatch(setJobDetails(job));
  }, [job, dispatch]);

  if (isPending) return <TripleDotLoader />;

  if (isError || !job) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#F4F6FA] text-center font-plus-jakarta">
        <p className="text-lg font-bold text-[#0F172A]">This job could not be found.</p>
        <Link
          href="/dashboard/jobs"
          className="rounded-xl bg-[#2451D6] px-5 py-3 text-sm font-bold text-white no-underline hover:bg-[#1A3FAF]"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  const numericJobId = Number(jobId);
  const cityName = job.city?.name ?? "";
  const companyHref = companyJobsHref(job.company.name, job.company.id);

  return (
    <div className="h-full overflow-y-auto bg-[#F4F6FA] font-plus-jakarta text-[#0F172A]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Suspense fallback={null}>
              <DashboardTopbarHamburgerMenu />
            </Suspense>
            <Link
              href="/dashboard/jobs"
              aria-label="Back to jobs"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E4E8F0] bg-white text-[#344054] hover:bg-[#EEF2FA] sm:flex"
            >
              <ChevronLeft className="h-[18px] w-[18px]" />
            </Link>
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 flex-wrap items-center gap-2 text-[15px] font-medium text-[#5B6478]"
            >
              <Link href="/dashboard/jobs" className="text-[#5B6478] no-underline hover:text-[#2451D6]">
                Jobs
              </Link>
              <span className="text-[#A3ACBD]">/</span>
              <Link href={companyHref} className="text-[#5B6478] no-underline hover:text-[#2451D6]">
                {job.company.name}
              </Link>
              <span className="text-[#A3ACBD]">/</span>
              <span className="truncate font-semibold text-[#0F172A]">{job.jobTitle.title}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2.5">
            <TodayDate />
            <DashboardTopbarLogoutButton />
          </div>
        </header>

        <JobDetailsCard
          jobId={numericJobId}
          img={job.company.logo}
          title={job.jobTitle.title}
          companyName={job.company.name}
          companyId={job.company.id}
          city={cityName}
          industry={job.company.industry?.name}
          created_at={job.created_at}
          apply_link={job.apply_link}
          isRemote={job.is_remote}
          specification={{
            experienceLevelName: job.experienceLevel.name,
            experienceLevel: `${job.experienceLevel.min_years}–${job.experienceLevel.max_years} years`,
            employmentType: job.employmentType.name,
            salaryMin: job.salary_min,
            salaryMax: job.salary_max,
            location: cityName,
          }}
        />

        <div className="flex flex-wrap items-start gap-5">
          <article className="min-w-0 flex-[999_1_520px] rounded-3xl border border-[#E4E8F0] bg-white p-5 sm:p-8">
            <JobSkills skills={job.skills} />

            <h2 className="mb-4 flex items-center gap-2.5 text-lg font-extrabold">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EAF0FD] text-[#2451D6]">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </span>
              About the role
            </h2>
            <JobDescription description={job.description} />

            <ApplyCta jobId={numericJobId} applyLink={job.apply_link} companyName={job.company.name} />
          </article>

          <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <CompanyCard
              website={job.company.website ?? ""}
              description={job.company.description ?? ""}
              industry={job.company.industry?.name ?? "—"}
              location={cityName}
              logoUrl={job.company.logo}
              name={job.company.name}
              size={formatCompanySize(job.company.companySize)}
            />
            <MoreJobsAtCompany
              currentJobId={numericJobId}
              companyName={job.company.name}
              companyId={job.company.id}
              companyLogo={job.company.logo}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
