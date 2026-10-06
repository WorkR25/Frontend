import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  DiffSourceToggleWrapper,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  Separator,
  ListsToggle,
  StrikeThroughSupSubToggles,
  CreateLink,
  CodeToggle,
  InsertImage,
  InsertThematicBreak,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
} from "@mdxeditor/editor";
import { FC } from "react";
import { FieldError } from "react-hook-form";

interface MarkdownEditorProps {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  error?: FieldError;
  placeholder: string;
  usingFor?: string;
  /** "basic" keeps only what job/company descriptions need. */
  toolbar?: "full" | "basic";
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value,
  onValueChange,
  error,
  placeholder,
  usingFor,
  toolbar = "full",
}) => {
  // const editorRef = useRef<HTMLDivElement>(null);
  // const [dynamicHeight, setDynamicHeight] = useState(height);

  // useEffect(() => {
  //   const textarea = editorRef.current?.querySelector("textarea");

  //   if (textarea) {
  //     textarea.style.height = "auto";
  //     const newHeight = textarea.scrollHeight;
  //     textarea.style.height = newHeight + "px";

  //     setDynamicHeight(Math.max(height, newHeight));
  //   }
  // }, [value, height]);

  return (
    <div className="border border-[#D8E0EE] rounded-[20px]">
      {/* <MDEditor
        value={value}
        onChange={onValueChange}
        data-color-mode="light"
        height={dynamicHeight}
        preview="edit"
        textareaProps={{
          placeholder,
        }}
        previewOptions={{
          rehypePlugins: [rehypeRaw, rehypeKatex],
          remarkPlugins: [remarkMath],
        }}
      /> */}

      <MDXEditor
        markdown={value || ""}
        placeholder={placeholder}
        onChange={onValueChange}
        className="email-editor-wrapper"
        contentEditableClassName={`${usingFor} email-editor-content prose max-w-none prose-code:text-black prose-headings:text-black prose-strong:text-black marker:text-black prose-a:text-blue-600 prose-a:hover:cursor-pointer prose-a:hover:text-blue-500 prose-blockquote:border-l-[#D8E0EE] prose-blockquote:bg-[#F8FAFD] prose-blockquote:text-[#66788C] prose-table:border-collapse prose-table:border prose-table:border-[#D8E0EE] prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-[0_6px_18px_rgba(15,23,42,0.05)] pl-8`}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          toolbarPlugin({
            toolbarContents: () =>
              toolbar === "basic" ? (
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <Separator />
                  <BlockTypeSelect />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <Separator />
                  <ListsToggle options={["bullet", "number"]} />
                  <Separator />
                  <CreateLink />
                </DiffSourceToggleWrapper>
              ) : (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <Separator />

                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />

                <StrikeThroughSupSubToggles />
                <ListsToggle />
                <Separator />

                <BlockTypeSelect />
                <Separator />

                <CreateLink />
                <InsertImage />
                <InsertThematicBreak />
              </DiffSourceToggleWrapper>
              ),
          }),
        ]}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default MarkdownEditor;
