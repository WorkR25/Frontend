import { BarChart3, Bookmark, Clock3, Lightbulb, Mail } from "lucide-react";
import ComingSoonBadge, { SOON_CARD } from "./ComingSoonBadge";

const STAGES = ["Applied", "Screening", "Interview", "Assessment", "Offer", "Accepted"];
const STAGE_TINTS = ["#C9D6F6", "#D4DEF8", "#DFE6F9", "#E7ECFA", "#EEF1FB", "#F3F5FC"];

function CardHeader({
  icon,
  tone,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
        <div className="min-w-0">
          <h2 className="text-[17px] font-extrabold leading-tight">{title}</h2>
          {subtitle && <p className="text-[13px] text-[#5B6478]">{subtitle}</p>}
        </div>
      </div>
      <ComingSoonBadge />
    </div>
  );
}

function GhostRow({ widths, pill }: { widths: [string, string]; pill?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-[#F7F8FC] p-3">
      <div className="h-9 w-9 shrink-0 rounded-[10px] bg-[#E9EDF4]" />
      <div className="flex-1">
        <div className="h-2.5 rounded-md bg-[#E2E7F0]" style={{ width: widths[0] }} />
        <div className="mt-2 h-2 rounded-md bg-[#ECEFF5]" style={{ width: widths[1] }} />
      </div>
      {pill && <div className="h-[22px] w-16 rounded-full" style={{ background: pill }} />}
    </div>
  );
}

export function ApplicationsComingSoon() {
  return (
    <section className={`${SOON_CARD} p-5 sm:p-6`}>
      <CardHeader
        icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
        tone="bg-[#EAF0FD] text-[#2451D6]"
        title="Your applications"
        subtitle="Where each application stands"
      />
      <div className="mt-5 grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-6" aria-hidden="true">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-col gap-2">
            <div className="h-2 rounded-full" style={{ background: STAGE_TINTS[i] }} />
            <div className="text-[13px] font-bold text-[#344054]">{stage}</div>
            <div className="text-[22px] font-extrabold text-[#C9D0DC]">—</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-[14px] border border-dashed border-[#D5DBE6] bg-[#F7F8FC] px-4 py-3.5">
        <Clock3 className="h-[18px] w-[18px] shrink-0 text-[#5B3CC4]" aria-hidden="true" />
        <p className="text-sm text-[#475066]">
          We’re building application tracking. Soon you’ll see every job you applied to, and what stage it’s at.
        </p>
      </div>
    </section>
  );
}

export function SavedJobsComingSoon() {
  return (
    <section className={`${SOON_CARD} flex flex-col gap-4 p-5`}>
      <CardHeader
        icon={<Bookmark className="h-5 w-5" aria-hidden="true" />}
        tone="bg-[#FFF4E0] text-[#8A4B00]"
        title="Saved jobs & deadlines"
      />
      <div className="flex flex-col gap-2.5" aria-hidden="true">
        <GhostRow widths={["60%", "40%"]} pill="#FDEBD3" />
        <GhostRow widths={["50%", "30%"]} pill="#ECEFF5" />
      </div>
      <p className="text-sm leading-relaxed text-[#475066]">
        Save jobs you like and we’ll remind you before the application closes.
      </p>
    </section>
  );
}

export function InvitesComingSoon() {
  return (
    <section className={`${SOON_CARD} flex flex-col gap-4 p-5`}>
      <CardHeader
        icon={<Mail className="h-5 w-5" aria-hidden="true" />}
        tone="bg-[#E3F6EC] text-[#11643C]"
        title="Interview invites"
      />
      <div className="flex items-center gap-3 rounded-[14px] bg-[#F7F8FC] p-3.5" aria-hidden="true">
        <div className="h-10 w-10 shrink-0 rounded-full bg-[#E9EDF4]" />
        <div className="flex-1">
          <div className="h-2.5 w-[70%] rounded-md bg-[#E2E7F0]" />
          <div className="mt-2 h-2 w-[45%] rounded-md bg-[#ECEFF5]" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-[30px] w-[30px] rounded-full bg-[#FBE6E8]" />
          <div className="h-[30px] w-[30px] rounded-full bg-[#E3F6EC]" />
        </div>
      </div>
      <p className="text-sm leading-relaxed text-[#475066]">
        When a company invites you to interview, you’ll accept or decline it right here.
      </p>
    </section>
  );
}

const BAR_HEIGHTS = ["30%", "55%", "40%", "75%", "50%", "90%", "65%"];

export function RecruiterViewsComingSoon() {
  return (
    <section className={`${SOON_CARD} flex flex-col gap-4 p-5`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-extrabold">Recruiter views</h2>
        <ComingSoonBadge />
      </div>
      <div className="flex h-[90px] items-end gap-2 px-1" aria-hidden="true">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md rounded-b-sm"
            style={{ height: h, background: i % 2 ? "#D8DFEC" : "#E2E7F0" }}
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-[#475066]">See how many recruiters viewed your profile each week.</p>
    </section>
  );
}

export function TipsComingSoon() {
  return (
    <section className="flex flex-col gap-3 rounded-[22px] border border-[#D5E1FA] bg-[#EAF0FD] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2451D6]">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
        </span>
        <ComingSoonBadge className="bg-white" />
      </div>
      <h2 className="text-[17px] font-extrabold text-[#142463]">Tips for your job search</h2>
      <p className="text-sm leading-relaxed text-[#344054]">
        Resume advice, interview prep and hiring trends — picked for you.
      </p>
    </section>
  );
}
