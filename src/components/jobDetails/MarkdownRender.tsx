'use client';

import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const styles = `
.markdown-content h1 {
  font-size: 2em;
  font-weight: bold;
  border-bottom: 1px solid #eaecef;
  padding-bottom: .3em;
  margin-top: 24px;
  margin-bottom: 16px;
}
.markdown-content h2 {
  font-size: 1.5em;
  font-weight: bold;
  border-bottom: 1px solid #eaecef;
  padding-bottom: .3em;
  margin-top: 24px;
  margin-bottom: 16px;
}
.markdown-content p {
  margin-bottom: 16px;
  line-height: 1.5;
}
.markdown-content ul {
  list-style-type: disc;
  padding-left: 2em;
  margin-bottom: 16px;
}
.markdown-content code {
  font-family: monospace;
  background-color: #f6f8fa;
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  border-radius: 6px;
}
.markdown-content pre {
    background-color: #f6f8fa;
    padding: 16px;
    overflow: auto;
    border-radius: 6px;
}
.markdown-content pre code {
    padding: 0;
    margin: 0;
    font-size: 100%;
    background-color: transparent;
}
`;

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
      
      <style>{styles}</style>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
