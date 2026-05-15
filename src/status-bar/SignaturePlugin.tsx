"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { PenLineIcon } from "lucide-react";

import { useRichTextEditorConfig } from "@/core/editor-config-context";
import { INSERT_SIGNATURE_COMMAND } from "@/lexical/signature-extension";
import { Button } from "@/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/tooltip";

export function SignaturePlugin() {
  const [editor] = useLexicalComposerContext();
  const { signer } = useRichTextEditorConfig();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-2"
          aria-label="Add electronic signature"
          onClick={() => {
            editor.dispatchCommand(INSERT_SIGNATURE_COMMAND, {
              signerName: signer.name,
              signerTitle: signer.title,
            });
          }}
        >
          <PenLineIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Add signature</TooltipContent>
    </Tooltip>
  );
}
