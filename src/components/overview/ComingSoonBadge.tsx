import { Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

export default function ComingSoonBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F1EDFF] px-2.5 py-1 text-xs font-extrabold text-[#5B3CC4]",
        className,
      )}
    >
      <Sparkles className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
      Coming soon
    </span>
  );
}

/** Faint diagonal stripes used on every "coming soon" card. */
export const SOON_CARD =
  "rounded-[22px] border border-[#E4E8F0] bg-white bg-[repeating-linear-gradient(135deg,rgba(91,60,196,0.035)_0_10px,transparent_10px_20px)]";
