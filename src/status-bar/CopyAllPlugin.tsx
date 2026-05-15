"use client";

import { useCallback, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/tooltip";

export function CopyAllPlugin() {
  const [editor] = useLexicalComposerContext();
  const [copied, setCopied] = useState(false);

  const copyAll = useCallback(async () => {
    const text = editor.getEditorState().read(() => $getRoot().getTextContent());
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API permission
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [editor]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-2"
          aria-label="Copy all note content"
          onClick={() => void copyAll()}
        >
          {copied ? (
            <CheckIcon className="size-4 text-green-600" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {copied ? "Copied" : "Copy all"}
      </TooltipContent>
    </Tooltip>
  );
}
