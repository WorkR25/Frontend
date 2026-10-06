"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function MarkdownHTML({ content }: { content: string }) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      async function convert() {
        const contentString = content || "";
        const raw = await marked.parse(contentString);
        const clean = DOMPurify.sanitize(raw);
        setHtml(clean);
      }

      convert();
    }
  }, [content]);

  return (
    <div
      className="
        markdown-content
        text-[#344054]
        [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-[28px] [&_h1]:font-semibold [&_h1]:leading-[1.15] [&_h1]:tracking-[-0.03em] [&_h1]:text-[#111827]
        [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-[20px] [&_h2]:font-extrabold [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.02em] [&_h2]:text-[#111827]
        [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-[18px] [&_h3]:font-extrabold [&_h3]:leading-[1.25] [&_h3]:text-[#111827]
        [&_p]:mb-4 [&_p]:text-[15px] sm:[&_p]:text-base [&_p]:leading-[1.75] [&_p]:text-[#344054]
        [&_strong]:font-semibold [&_strong]:text-[#111827]
        [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc
        [&_ol]:mb-4 [&_ol]:ml-5 [&_ol]:list-decimal
        [&_li]:mb-3 [&_li]:text-[15px] sm:[&_li]:text-base [&_li]:leading-[1.75] [&_li]:text-[#344054]
        [&_a]:font-medium [&_a]:text-[#2563EB] hover:[&_a]:underline
        [&_blockquote]:my-4 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#D0DDFB] [&_blockquote]:bg-[#F8FBFF] [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-[#475467]
        [&_hr]:my-6 [&_hr]:border-[#EAECF0]
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}