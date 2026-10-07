"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import AuthHero from "./AuthHero";

/** Two-panel layout shared by the login and signup pages. */
export default function AuthShell({
  title,
  subtitle,
  switchText,
  switchLabel,
  switchHref,
  wide = false,
  children,
}: {
  title: string;
  subtitle: string;
  switchText: string;
  switchLabel: string;
  switchHref: string;
  /** Wider form column (signup uses two columns). */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="h-full w-full bg-[#F4F6FA] font-plus-jakarta text-[#0F172A]">
      <div className="grid h-full w-full gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
        <div className="flex min-h-0 flex-col overflow-y-auto rounded-[28px] border border-[#E4E8F0] bg-white">
          <header className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-10 sm:pt-8">
            <Link href="/dashboard" aria-label="WorkR home">
              <Image
                src="/WorkR-Full-Logo2.png"
                alt="WorkR"
                width={110}
                height={44}
                priority
                className="h-auto w-[96px]"
              />
            </Link>
            <p className="text-sm text-[#5B6478]">
              <span className="hidden sm:inline">{switchText} </span>
              <Link href={switchHref} className="font-bold text-[#2451D6] no-underline hover:text-[#1A3FAF]">
                {switchLabel}
              </Link>
            </p>
          </header>

          <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
            <div className={wide ? "w-full max-w-[540px]" : "w-full max-w-[420px]"}>
              <h1 className="text-[28px] font-extrabold tracking-[-0.02em] sm:text-[32px]">{title}</h1>
              <p className="mt-1.5 text-[15px] text-[#5B6478]">{subtitle}</p>
              <div className="mt-8">{children}</div>
            </div>
          </main>

          <footer className="px-6 pb-6 text-center text-xs text-[#8A93A6] sm:px-10">
            © WorkR
          </footer>
        </div>

        <div className="hidden min-h-0 lg:block">
          <AuthHero />
        </div>
      </div>
    </div>
  );
}
