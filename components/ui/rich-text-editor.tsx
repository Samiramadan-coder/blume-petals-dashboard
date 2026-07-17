"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:pointer-events-none before:h-0 before:block before:text-start before:text-muted-foreground before:content-[attr(data-placeholder)]",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] w-full border-0 bg-white px-3 py-2 text-start text-sm outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-border bg-primary/10 p-2">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Bold className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Italic className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading") ? "default" : "ghost"}
          size="xs"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="h-8 w-8 p-0 text-foreground"
        >
          <Heading2 className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <List className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <ListOrdered className="size-3 text-muted-foreground" />
        </Button>
      </div>

      <div className="bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-28 [&_.ProseMirror]:border-0 [&_.ProseMirror]:outline-none [&_.ProseMirror]:bg-white"
        />
      </div>
    </div>
  );
}
