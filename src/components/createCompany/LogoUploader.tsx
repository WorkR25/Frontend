"use client";

import { ImageUp, Trash2 } from "lucide-react";
import Image from "next/image";
import { DragEvent, useEffect, useId, useMemo, useState } from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/utils/cn";
import { getCompanyMonogram, getCompanyTint } from "@/utils/companyBrand";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/jpg"];

/** Compact logo picker: square preview (or monogram), upload/replace/remove, drag & drop. */
export default function LogoUploader({
  file,
  onFileChange,
  companyName,
  error,
}: {
  file: File | null | undefined;
  onFileChange: (file: File | undefined) => void;
  companyName: string;
  error?: FieldError;
}) {
  const inputId = useId();
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const accept = (selected: File | undefined) => {
    if (!selected) return;
    if (!ACCEPTED.includes(selected.type)) {
      setLocalError("Logo must be a PNG or JPG image.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setLocalError("Logo must be 2 MB or smaller.");
      return;
    }
    setLocalError(null);
    onFileChange(selected);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    accept(e.dataTransfer.files?.[0]);
  };

  const tint = getCompanyTint(companyName || "Company");
  const message = localError ?? error?.message;

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
          "flex flex-wrap items-center gap-4 rounded-2xl border-[1.5px] border-dashed p-4 transition-colors",
          dragActive ? "border-[#2451D6] bg-[#F4F7FF]" : message ? "border-red-300" : "border-[#D5DBE6]",
        )}
      >
        <span
          className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E4E8F0]"
          style={previewUrl ? { background: "#FFFFFF" } : { background: tint.bg, color: tint.fg }}
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="Logo preview" fill unoptimized className="object-contain p-2" />
          ) : (
            <span className="text-xl font-extrabold">{getCompanyMonogram(companyName || "Company")}</span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-[#0F172A]">
            {file ? file.name : "Drag a logo here, or upload one"}
          </div>
          <div className="mt-0.5 text-xs text-[#5B6478]">PNG or JPG · square · at least 200×200 px · max 2 MB</div>
        </div>

        <div className="flex gap-2">
          <label
            htmlFor={inputId}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-[#B9CBF3] bg-white px-3.5 text-sm font-bold text-[#2451D6] hover:border-[#2451D6]"
          >
            <ImageUp className="h-4 w-4" aria-hidden="true" />
            {file ? "Replace" : "Upload logo"}
          </label>
          <input
            id={inputId}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="sr-only"
            onChange={(e) => {
              accept(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {file && (
            <button
              type="button"
              aria-label="Remove logo"
              onClick={() => onFileChange(undefined)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#E4E8F0] bg-white text-[#5B6478] hover:text-[#D92D20]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {message && <p className="ml-1 mt-2 text-sm font-medium text-red-500">{message}</p>}
    </div>
  );
}
