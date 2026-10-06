"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

function formatToday() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Today's date, rendered in the browser. (Rendering it on the server
 * froze it at build time, which is why the jobs page showed an old date.)
 */
export default function TodayDate({ className }: { className?: string }) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(formatToday());
  }, []);

  return (
    <div
      className={cn(
        "hidden items-center gap-2 rounded-[10px] border border-[#E4E8F0] bg-white px-3.5 py-[9px] text-sm font-semibold text-[#344054] sm:flex",
        className,
      )}
    >
      <Calendar className="h-4 w-4" aria-hidden="true" />
      <span className="min-w-[7.5rem]">{today ?? " "}</span>
    </div>
  );
}
