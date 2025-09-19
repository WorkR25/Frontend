import { cn } from "@/utils/cn";

export default function JobSkills({
  skills,
  className,
}: {
  skills: { id: number; name: string }[];
  className?: string;
}) {
  return (
    <div className={cn(`hidden w-full p-4 border border-gray-200 rounded-xl bg-[#FFFF] `, className)}>
      <div className="m-1 mb-5 text-lg font-semibold">Required Skills</div>
      <div className="w-full flex flex-wrap items-center justify-center gap-2 ">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#E7F2F8] text-[#28668B] p-2 rounded-2xl border  border-gray-300 "
          >
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
}
