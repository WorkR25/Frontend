"use client";

import { useAppSelector } from "@/lib/hooks";
import MarkdownHTML from "./MarkdownRender";

export default function JobDescription({ description }: { description?: string }) {
  const jobDetails = useAppSelector((state) => state.jobDetails.value);
  const content = description ?? jobDetails?.description;

  return (
    <div className="job-description max-w-[74ch] text-base leading-[1.75] text-[#344054]">
      <MarkdownHTML content={content || "No job description available."} />
    </div>
  );
}
