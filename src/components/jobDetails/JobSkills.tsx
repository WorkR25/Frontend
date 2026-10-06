import { Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { SHOW_JOB_SKILLS } from "@/utils/featureFlags";

/** "Skills you'll use" block. Built, hidden until SHOW_JOB_SKILLS is enabled. */
export default function JobSkills({
  skills,
  className,
}: {
  skills: { id: number; name: string }[];
  className?: string;
}) {
  if (!skills?.length) return null;

  return (
    <div
      className={cn(
        "mb-7 flex flex-col gap-3.5 border-b border-dashed border-[#E1E6EF] pb-7",
        !SHOW_JOB_SKILLS && "hidden",
        className,
      )}
    >
      <h2 className="flex items-center gap-2.5 text-lg font-extrabold">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EAF0FD] text-[#2451D6]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        Skills you’ll use
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-xl border border-[#E4E8F0] bg-[#F4F6FA] px-3.5 py-2 text-sm font-semibold text-[#0F172A]"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
