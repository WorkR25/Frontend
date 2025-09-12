'use client';

import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";


export default function MarkdownHTML({ content }: { content: string }) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    <>
      <div
        className="markdown-content text-black"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
