import { Check, ChevronRight } from "lucide-react";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { getCompletionPercentage } from "@/utils/getCompletionPercentage";
import { getProfileChecklist } from "@/utils/profileChecklist";

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Navy card with the completion ring and every checklist item, linking to its section. */
export default function ProfileChecklist({ user }: { user: GetUserResponseType }) {
  const percent = getCompletionPercentage(user);
  const items = getProfileChecklist(user);
  const doneCount = items.filter((i) => i.done).length;
  const complete = doneCount === items.length;

  return (
    <section className="flex flex-col gap-5 rounded-[22px] bg-[#142463] bg-[radial-gradient(rgba(255,255,255,0.09)_1.2px,transparent_1.2px)] bg-[size:22px_22px] p-6 text-white">
      <div className="flex items-center gap-[18px]">
        <div className="relative h-[92px] w-[92px] shrink-0">
          <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true">
            <circle cx="46" cy="46" r={RADIUS} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="10" />
            <circle
              cx="46"
              cy="46"
              r={RADIUS}
              fill="none"
              stroke="#5BE49B"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              transform="rotate(-90 46 46)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[22px] font-extrabold">
            {percent}%
          </div>
        </div>
        <div>
          <h2 className="text-lg font-extrabold">Profile strength</h2>
          <p className="mt-1 text-[13px] leading-normal text-[#C9D3F0]">
            {complete
              ? "All done. Recruiters can see your full profile."
              : `${doneCount} of ${items.length} done. Complete profiles get noticed faster.`}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-1 rounded-[14px] bg-white/[0.08] p-2">
        {items.map((item) => (
          <li key={item.label} className={cn(item.done && "hidden xl:block")}>
            <a
              href={`#${item.section}`}
              className="group flex items-center gap-2.5 rounded-[10px] px-2 py-2 text-sm text-white no-underline hover:bg-white/[0.08]"
            >
              {item.done ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1FA463]">
                  <Check className="h-3 w-3" strokeWidth={3.2} aria-hidden="true" />
                </span>
              ) : (
                <span className="h-5 w-5 shrink-0 rounded-full border-[1.5px] border-white/50" aria-hidden="true" />
              )}
              <span className={cn("flex-1", item.done ? "text-[#C9D3F0] line-through" : "font-semibold")}>
                {item.label}
                {item.done && <span className="sr-only"> (done)</span>}
              </span>
              {!item.done && (
                <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white" aria-hidden="true" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
