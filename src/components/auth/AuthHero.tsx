import { BadgeCheck, MapPin, Search, Sparkles } from "lucide-react";

const POINTS = [
  { icon: Sparkles, text: "Fresh openings from product companies, every day" },
  { icon: Search, text: "Search by role or company and filter remote, on-site and internships" },
  { icon: BadgeCheck, text: "Build one profile and apply in a click" },
];

/** Illustrative sample cards; not real listings. */
const SAMPLE_JOBS = [
  { mono: "N", tint: "#EAF0FD", fg: "#1A3FAF", title: "Senior Frontend Engineer", meta: "Bengaluru · Full time", tag: "New" },
  { mono: "A", tint: "#E3F6EC", fg: "#11643C", title: "Backend Engineer II", meta: "Remote · Full time", tag: "Remote" },
  { mono: "S", tint: "#FFF4E0", fg: "#8A4B00", title: "SDE Intern", meta: "Hyderabad · Internship", tag: "Intern" },
];

export default function AuthHero() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[28px] bg-[#142463] bg-[radial-gradient(rgba(255,255,255,0.08)_1.2px,transparent_1.2px)] bg-[size:22px_22px] p-10 text-white xl:p-14">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(36,81,214,0.55)_0%,rgba(36,81,214,0)_70%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-[520px]">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-[#C9D3F0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5BE49B]" aria-hidden="true" />
          WORKR JOBS
        </span>
        <h2 className="mt-5 text-[40px] font-extrabold leading-[1.08] tracking-[-0.02em] xl:text-[46px]">
          Find your next role, faster.
        </h2>
        <ul className="mt-7 flex flex-col gap-3.5">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-[15px] leading-snug text-[#DCE3F7]">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Icon className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-10 flex flex-col gap-3" aria-hidden="true">
        {SAMPLE_JOBS.map((job, i) => (
          <div
            key={job.title}
            className="flex items-center gap-3.5 rounded-2xl bg-white p-4 text-[#0F172A] shadow-[0_18px_40px_rgba(5,12,40,0.35)]"
            style={{ marginLeft: `${i * 28}px`, marginRight: `${(2 - i) * 28}px`, opacity: 1 - i * 0.12 }}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-extrabold"
              style={{ background: job.tint, color: job.fg }}
            >
              {job.mono}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-bold">{job.title}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[13px] text-[#5B6478]">
                <MapPin className="h-3.5 w-3.5" />
                {job.meta}
              </span>
            </span>
            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ background: job.tint, color: job.fg }}
            >
              {job.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
