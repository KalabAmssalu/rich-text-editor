"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { TextCursorInputIcon } from "lucide-react";

import { useAutocompleteEnabled } from "@/lexical/autocomplete-context";
import { Button } from "@/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/tooltip";
import { cn } from "@/lib/utils";

export function AutoCompleteTogglePlugin() {
  const [editor] = useLexicalComposerContext();
  const { enabled, toggle } = useAutocompleteEnabled();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "p-2",
            enabled && "bg-accent text-accent-foreground",
          )}
          aria-label={
            enabled ? "Disable autocomplete" : "Enable autocomplete"
          }
          aria-pressed={enabled}
          onClick={() => {
            toggle();
            editor.focus();
          }}
        >
          <TextCursorInputIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {enabled
          ? "Autocomplete on — Tab to accept (medical, chart & dictionary)"
          : "Autocomplete off — click to enable"}
      </TooltipContent>
    </Tooltip>
  );
}
