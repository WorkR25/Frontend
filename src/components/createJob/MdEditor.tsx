import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";
import { FieldError } from "react-hook-form";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

interface MdEdiotorProps {
  value: string | undefined;
  onFileChange: (value: string | undefined) => void;
  error?: FieldError;
  onChangeFn?: () => void;
}

const MarkdownEditor: FC<MdEdiotorProps> = ({ value, onFileChange, error }) => {
  return (
    <div className="h-[50px]">
      <MDEditor
        value={value ?? undefined}
        onChange={onFileChange}
        data-color-mode="light"
        height={600}
        overflow={true}
        preview="edit"
        previewOptions={{
          rehypePlugins: [rehypeRaw, rehypeKatex],
          remarkPlugins: [remarkMath],
        }}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default MarkdownEditor;
