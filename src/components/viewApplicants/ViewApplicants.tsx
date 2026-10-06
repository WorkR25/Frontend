"use client";

import { Download, UsersRound } from "lucide-react";
import { useState } from "react";
import { CandidateRow, CandidateRowSkeleton, CandidateType } from "@/components/allCandidates/CandidatesLists";
import CompanyLogo from "@/components/CompanyLogo";
import JobsPagination from "@/components/exploreJobs/JobsPagination";
import FormModal from "@/components/ui/FormModal";
import { setShowJobApplicants } from "@/features/showJobApplicants/showJobApplicantsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { timeAgo } from "@/utils/getTime";
import useGetJobApplicantsPagination from "@/utils/useGetJobApplicantsPagination";
import useGetJobDetails from "@/utils/useGetJobDetails";

const PAGE_SIZE = 20;
const GRID = "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1fr)_96px]";

type Applicant = GetUserResponseType & {
  candidate_id?: number;
  applied_at?: string | null;
  profile: GetUserResponseType["profile"] & { details?: string | null };
};

function toCsv(rows: Applicant[]) {
  const head = ["Name", "Email", "Phone", "Type", "Domain", "Company", "Graduation year", "Resume", "LinkedIn", "Applied at"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.fullName,
      r.email,
      r.phoneNo,
      r.profile?.details ?? "",
      r.profile?.domain ?? "",
      r.profile?.currentCompany ?? "",
      r.graduationYear ?? "",
      r.profile?.resumeUrl ?? "",
      r.profile?.linkedinUrl ?? "",
      r.applied_at ?? "",
    ]
      .map(esc)
      .join(","),
  );
  return [head.map(esc).join(","), ...lines].join("\n");
}

export default function ViewApplicants({ jobId }: { jobId: number; className?: string }) {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const [page, setPage] = useState(1);

  const { data: job } = useGetJobDetails(jwtToken, String(jobId));
  const { data, isPending, isError, isFetching } = useGetJobApplicantsPagination({
    jwtToken,
    jobId,
    limit: PAGE_SIZE,
    page,
  });

  const records: Applicant[] = data?.records ?? [];
  const total: number | undefined = data?.pagination?.totalCount;
  const totalPages: number = data?.pagination?.totalPages ?? 0;

  const close = () => dispatch(setShowJobApplicants(false));

  const downloadPage = () => {
    const blob = new Blob([toCsv(records)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applicants-job-${jobId}${totalPages > 1 ? `-page-${page}` : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <FormModal
      title="Applicants"
      subtitle={
        total == null
          ? "Loading applicants…"
          : `${total.toLocaleString("en-IN")} ${total === 1 ? "person has" : "people have"} applied to this job.`
      }
      icon={<UsersRound className="h-[22px] w-[22px]" aria-hidden="true" />}
      iconTone="bg-[#E3F6EC] text-[#11643C]"
      onClose={close}
      widthClassName="sm:max-w-[1240px] sm:h-[92vh]"
      footer={
        totalPages > 1 ? (
          <JobsPagination page={page} totalPages={totalPages} onChange={setPage} />
        ) : (
          <div className="text-[13px] text-[#5B6478]">Newest applications first.</div>
        )
      }
    >
      {job && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#E4E8F0] bg-white p-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <CompanyLogo
              name={job.company.name}
              logo={job.company.logo}
              className="h-12 w-12 rounded-xl border border-[#EEF1F6]"
              textClassName="text-sm"
              imagePadding="p-1.5"
            />
            <div className="min-w-0">
              <div className="truncate text-base font-extrabold">{job.jobTitle.title}</div>
              <div className="truncate text-[13px] text-[#5B6478]">
                {job.company.name} · {job.city?.name} · {job.employmentType?.name} · posted {timeAgo(String(job.created_at))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={downloadPage}
            disabled={records.length === 0}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-[#B9CBF3] bg-white px-4 text-sm font-bold text-[#2451D6] hover:border-[#2451D6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {totalPages > 1 ? "Download this page (CSV)" : "Download CSV"}
          </button>
        </div>
      )}

      {isError && !data ? (
        <div className="rounded-2xl border border-[#E4E8F0] bg-white px-6 py-12 text-center text-base font-bold">
          We couldn’t load applicants.
        </div>
      ) : isPending ? (
        <div className="flex flex-col gap-2.5" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <CandidateRowSkeleton key={i} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#C9D2E3] bg-white px-6 py-16 text-center">
          <UsersRound className="h-7 w-7 text-[#8A93A6]" aria-hidden="true" />
          <p className="text-base font-bold">No applicants yet</p>
          <p className="text-sm text-[#5B6478]">When candidates click Apply on this job, they’ll show up here.</p>
        </div>
      ) : (
        <div className={cn("flex flex-col gap-2.5 transition-opacity", isFetching && "opacity-60")}>
          {records.map((applicant) => {
            const type: CandidateType =
              applicant.profile?.details === "Working Professional" ? "Working Professional" : "Student";
            return (
              <CandidateRow
                key={`${applicant.candidate_id ?? applicant.id}`}
                user={applicant}
                type={type}
                showType
                gridClassName={GRID}
                subtitle={applicant.applied_at ? `Applied ${timeAgo(String(applicant.applied_at))}` : undefined}
              />
            );
          })}
        </div>
      )}
    </FormModal>
  );
}
