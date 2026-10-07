"use client";

import useJobActions from "./useJobActions";

/** Closing call-to-action at the end of the job description. */
export default function ApplyCta({
  jobId,
  applyLink,
  companyName,
  jobTitle,
  companyLogo,
}: {
  jobId: number;
  applyLink: string;
  companyName: string;
  jobTitle?: string;
  companyLogo?: string | null;
}) {
  const { apply, requestReferral } = useJobActions(jobId, applyLink, { title: jobTitle, companyName, companyLogo });

  return (
    <div className="mt-9 flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-[#142463] bg-[radial-gradient(rgba(255,255,255,0.09)_1.2px,transparent_1.2px)] bg-[size:22px_22px] p-6 text-white sm:p-7">
      <div>
        <div className="text-xl font-extrabold tracking-[-0.02em]">Sounds like you?</div>
        <div className="mt-1 text-sm text-[#C9D3F0]">
          Apply directly, or ask for a referral from someone at {companyName}.
        </div>
      </div>
      <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
        <button
          type="button"
          onClick={requestReferral}
          className="h-[46px] flex-1 cursor-pointer rounded-xl border border-white/35 bg-transparent px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:flex-none"
        >
          Request referral
        </button>
        <button
          type="button"
          onClick={apply}
          className="h-[46px] flex-1 cursor-pointer rounded-xl bg-white px-[22px] text-sm font-extrabold text-[#142463] transition-colors hover:bg-[#E6ECFF] sm:flex-none"
        >
          Apply now
        </button>
      </div>
    </div>
  );
}
