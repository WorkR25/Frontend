"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { getCompanyMonogram, getCompanyTint } from "@/utils/companyBrand";

type CompanyLogoProps = {
  name: string;
  logo?: string | null;
  /** Classes for the outer tile: size, radius, border, shadow. */
  className?: string;
  /** Classes for the monogram text (font size). */
  textClassName?: string;
  /** Inner padding around a real logo image. */
  imagePadding?: string;
};

/**
 * Company logo tile. Shows the uploaded logo on white, or a coloured
 * monogram when there is no logo (or it fails to load).
 */
export default function CompanyLogo({
  name,
  logo,
  className,
  textClassName = "text-[15px]",
  imagePadding = "p-2",
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const tint = getCompanyTint(name);
  const showImage = !!logo && !failed;

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        className,
      )}
      style={showImage ? { background: "#FFFFFF" } : { background: tint.bg, color: tint.fg }}
    >
      {showImage ? (
        <span className={cn("relative h-full w-full", imagePadding)}>
          <span className="relative block h-full w-full">
            <Image
              src={logo!}
              alt={`${name} logo`}
              fill
              sizes="96px"
              unoptimized
              className="object-contain"
              onError={() => setFailed(true)}
            />
          </span>
        </span>
      ) : (
        <span className={cn("font-extrabold", textClassName)} aria-label={`${name} logo`}>
          {getCompanyMonogram(name)}
        </span>
      )}
    </span>
  );
}
