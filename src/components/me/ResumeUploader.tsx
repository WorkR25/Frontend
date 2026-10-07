"use client";

import { ExternalLink, FileText, Loader2, Upload } from "lucide-react";
import { DragEvent, useId, useState } from "react";
import { cn } from "@/utils/cn";
import useUploadUserResume from "@/utils/useUploadUserResume";

const MAX_MB = 5;
const EXTENSIONS = [".pdf", ".png"];

function fileNameFromUrl(url: string) {
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    return last ? decodeURIComponent(last) : "Resume";
  } catch {
    return "Resume";
  }
}

/** Resume picker: shows the current resume and uploads a new one (PDF/PNG, drag & drop). */
export default function ResumeUploader({
  value,
  jwtToken,
  onUploaded,
  unsaved,
}: {
  value?: string | null;
  jwtToken: string;
  onUploaded: (url: string) => void;
  unsaved?: boolean;
}) {
  const inputId = useId();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: upload, isPending } = useUploadUserResume();

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setError("Resume must be a PDF or PNG file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Resume must be ${MAX_MB} MB or smaller.`);
      return;
    }
    setError(null);
    upload(
      { authJwtToken: jwtToken, file },
      { onSuccess: (data: { data: { fileUrl: string } }) => onUploaded(String(data.data.fileUrl)) },
    );
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (!isPending) handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-wrap items-center gap-4 rounded-2xl border-[1.5px] p-4 transition-colors",
          dragActive
            ? "border-dashed border-[#2451D6] bg-[#F4F7FF]"
            : value
              ? "border-[#E4E8F0] bg-white"
              : "border-dashed border-[#D5DBE6] bg-[#FAFBFD]",
          error && "border-red-300",
        )}
      >
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            value ? "bg-[#FDECEC] text-[#C2362B]" : "bg-[#EAF0FD] text-[#2451D6]",
          )}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <FileText className="h-5 w-5" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-[170px] flex-1">
          <div className="truncate text-sm font-bold text-[#0F172A]">
            {isPending ? "Uploading…" : value ? fileNameFromUrl(value) : "Upload your resume"}
          </div>
          <div className="mt-0.5 text-xs text-[#5B6478]">
            {value && unsaved ? (
              <span className="font-semibold text-[#8A4B00]">Uploaded. Save your profile to keep it.</span>
            ) : (
              <>Drag & drop or browse · PDF or PNG · max {MAX_MB} MB</>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E4E8F0] bg-white px-3.5 text-sm font-bold text-[#0F172A] no-underline hover:bg-[#F4F6FA]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View
            </a>
          )}
          <label
            htmlFor={inputId}
            aria-disabled={isPending}
            className={cn(
              "flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-[#B9CBF3] bg-white px-3.5 text-sm font-bold text-[#2451D6] hover:border-[#2451D6]",
              isPending && "pointer-events-none opacity-60",
            )}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {value ? "Replace" : "Upload"}
          </label>
          <input
            id={inputId}
            type="file"
            accept={EXTENSIONS.join(",")}
            className="sr-only"
            disabled={isPending}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {error && <p className="ml-1 mt-1.5 text-[13px] font-medium text-[#D92D20]">{error}</p>}
    </div>
  );
}
