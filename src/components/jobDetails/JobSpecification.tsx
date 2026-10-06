import { Award, Briefcase, Building2, Layers, Wallet } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type JobSpecificationProps = {
  experienceLevelName: string;
  experienceLevel: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
};

function FactTile({
  label,
  value,
  icon,
  tone,
  className,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: { tile: string; icon: string };
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3.5 rounded-2xl border p-4", tone.tile, className)}>
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone.icon)}>
        {icon}
      </span>
      <div>
        <div className="text-xs font-semibold text-[#5B6478]">{label}</div>
        <div className="text-[17px] font-extrabold text-[#0F172A]">{value}</div>
      </div>
    </div>
  );
}

const TONES = {
  purple: { tile: "border-[#E8E2FB] bg-[#F7F4FF]", icon: "bg-[#E8E0FF] text-[#5B3CC4]" },
  amber: { tile: "border-[#F6E3BF] bg-[#FFF9EE]", icon: "bg-[#FFEBC7] text-[#8A4B00]" },
  green: { tile: "border-[#CDEBDB] bg-[#F2FBF6]", icon: "bg-[#D9F2E5] text-[#11643C]" },
  blue: { tile: "border-[#D5E1FA] bg-[#F3F7FF]", icon: "bg-[#DDE7FD] text-[#1A3FAF]" },
};

export default function JobSpecification({
  experienceLevelName,
  experienceLevel,
  employmentType,
  salaryMin,
  salaryMax,
  location,
}: JobSpecificationProps) {
  const isRemote = location?.trim().toLowerCase() === "remote";
  const iconProps = { className: "h-5 w-5", "aria-hidden": true } as const;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5 p-5 sm:px-8 sm:py-6">
      <FactTile label="Level" value={experienceLevelName} icon={<Layers {...iconProps} />} tone={TONES.purple} />
      <FactTile label="Experience" value={experienceLevel} icon={<Award {...iconProps} />} tone={TONES.amber} />
      <FactTile label="Job type" value={employmentType} icon={<Briefcase {...iconProps} />} tone={TONES.green} />
      <FactTile label="Work type" value={isRemote ? "Remote" : "On-site"} icon={<Building2 {...iconProps} />} tone={TONES.blue} />
      {/* Salary is captured but not shown to candidates yet. */}
      <FactTile
        className="hidden"
        label="Salary range"
        value={
          employmentType === "Internship"
            ? `${Number(salaryMin)}K - ${Number(salaryMax)}K`
            : `${Number(salaryMin)} LPA - ${Number(salaryMax)} LPA`
        }
        icon={<Wallet {...iconProps} />}
        tone={TONES.blue}
      />
    </div>
  );
}
