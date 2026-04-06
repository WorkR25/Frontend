import Image from "next/image";
import React, { useEffect, useMemo, useState, DragEvent, useRef } from "react";
import { FieldError } from "react-hook-form";

interface DragAndDropFileProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: FieldError;
  onChangeFn?: () => void;
}

export default function DragAndDropFileBlob({
  file,
  onFileChange,
  error,
  onChangeFn,
}: DragAndDropFileProps) {
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileUpload = (selectedFile: File) => {
    onFileChange(selectedFile);
    onChangeFn?.();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`components-createCompany-DragAndDropFile drag-drop-container justify-center ${
        dragActive ? "active" : ""
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <div
        onClick={handleClick}
        className="border-2 border-dashed border-blue-300 bg-[#f5f9fd] rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] ?? null;
            if (selectedFile) {
              handleFileUpload(selectedFile);
            }
          }}
          className="hidden components-createCompany-DragAndDropFile border w-full rounded-lg p-4 hover:cursor-pointer"
          id="upload-input"
        />

        {/* UI */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-blue-100 p-3 rounded-full">
            <Image
              src="/drag-drop-upload-logo.svg"
              alt="Upload Icon"
              width={47}
              height={47}
            />
          </div>

          <p className="text-[#254497] font-medium text-lg">
            Drag & drop or click to upload
          </p>

          <p className="text-lg text-gray-500">PNG, JPG or SVG (max 2MB)</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">{error.message}</p>
      )}

      <div className="mt-3">
        {/* Preview header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-px bg-gray-400" />
          <p className="text-lg text-gray-500">Preview</p>
          <div className="flex-1 h-px bg-gray-400" />
        </div>

        <div className="flex items-center gap-4">
          <div className="h-18 w-18 rounded-xl bg-[#dde9fc] flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="logo preview"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-[#2575f0] font-bold text-3xl">AC</span>
            )}
          </div>

          <div>
            <p className="font-semibold text-lg text-gray-800">Company logo</p>
            <p className="text-md text-gray-500">Preview will appear here</p>
          </div>
        </div>

        <div className="mt-4 bg-[#e7f1fc] rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 rounded-full">ℹ</span>
            <div>
              <p className="text-blue-600 font-medium mb-1">Logo tips</p>
              <ul className="text-sm text-gray-600 list-disc ml-4 space-y-1">
                <li>Use a square image (1:1 ratio)</li>
                <li>Minimum size 200×200px</li>
                <li>Transparent background works best</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
