"use client";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TurndownService from "turndown";
import { useFormContext } from "react-hook-form";

interface MarkdownEditorProps {
  fieldName: string;
  showFormatOptions?: boolean;
  isSuccess?: boolean;
}

export default function MarkdownEditor({ fieldName, showFormatOptions = true, isSuccess = false }: MarkdownEditorProps) {
  const [activePanel, setActivePanel] = useState({
    bold: false,
    italic: false,
    bulletList: false,
    orderedList: false,
    h1: false,
    h2: false,
    h3: false,
    h4: false,
  });

  const { setValue, register } = useFormContext();
  const turndownService = new TurndownService();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);

      setValue(fieldName, markdown, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  useEffect(()=>{
    if(isSuccess){
      editor?.commands.setContent(''); 
    }
  },[isSuccess, editor])

  useEffect(() => {
    register(fieldName, { required: true });
  }, [fieldName, register]);

  return (
    <div className="border rounded-lg p-2">
      {showFormatOptions && (
        <div className="toolbar mb-2 space-x-2">
        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleBold().run();
            setActivePanel((prev) => ({ ...prev, bold: !prev.bold }));
          }}
          className={`px-2 py-1 border rounded ${activePanel.bold ? "bg-gray-200" : ""}`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleItalic().run();
            setActivePanel((prev) => ({ ...prev, italic: !prev.italic }));
          }}
          className={`px-2 py-1 border rounded ${activePanel.italic ? "bg-gray-200" : ""}`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleBulletList().run();
            setActivePanel((prev) => ({ ...prev, bulletList: !prev.bulletList }));
          }}
          className={`px-2 py-1 border rounded ${activePanel.bulletList ? "bg-gray-200" : ""}`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleOrderedList().run();
            setActivePanel((prev) => ({ ...prev, orderedList: !prev.orderedList }));
          }}
          className={`px-2 py-1 border rounded ${activePanel.orderedList ? "bg-gray-200" : ""}`}
        >
          1. List
        </button>

        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
              setActivePanel((prev) => ({ ...prev, [`h${level}`]: !prev[`h${level}` as keyof typeof prev] }));
            }}
            className={`px-2 py-1 border rounded ${
              activePanel[`h${level}` as keyof typeof activePanel] ? "bg-gray-200" : ""
            }`}
          >
            H{level}
          </button>
        ))}
      </div>
      )}

      {/* Editor displays PREVIEW */}
      <EditorContent editor={editor} className="h-fit outline-none p-2" />
    </div>
  );
}
