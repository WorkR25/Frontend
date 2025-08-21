import React, { useState, DragEvent } from "react";
import { useFormContext } from "react-hook-form";
import useUploadLogo from "@/utils/useUploadLogo";

interface DragAndDropFileProps {
  maxFileSize: number; // MB
  fileExtension: string[];
  jwtToken: string | null;
}

export default function DragAndDropFile({
  maxFileSize,
  fileExtension,
  jwtToken,
}: DragAndDropFileProps) {
  const { setValue } = useFormContext();
  const { mutate: uploadLogo, isPending } = useUploadLogo();
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File) => {
    if (file.size > maxFileSize * 1024 * 1024) {
      alert(`File too large. Max ${maxFileSize} MB`);
      return false;
    }
    if (!fileExtension.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      alert(`Invalid file type. Allowed: ${fileExtension.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleFileUpload = (file: File) => {
    if (!file || !jwtToken) return;

    if (validateFile(file)) {
      uploadLogo(
        { authJwtToken: jwtToken, file },
        {
          onSuccess: (data: { data: { fileUrl: string } }) => {
            setValue("logo", String(data.data.fileUrl), {
              shouldValidate: true,
              shouldDirty: true,
            });
          },
        }
      );
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div
      className={`components-createCompany-DragAndDropFile drag-drop-container justify-center ${dragActive ? "active" : ""}`}
      onDragEnter={() => setDragActive(true)}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={fileExtension.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="components-createCompany-DragAndDropFile border w-full rounded-lg p-4 hover:cursor-pointer "
        id="upload-input"
      />
      <div>
        <label htmlFor="upload-input" className="components-createCompany-DragAndDropFile ">
        {isPending
          ? "Uploading..."
          : dragActive
          ? "Drop your file here"
          : "Choose file to upload"}
      </label>
      </div>
    </div>
  );
};
