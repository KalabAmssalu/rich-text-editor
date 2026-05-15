"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { FileStackIcon, PlusIcon } from "lucide-react";

import { useRichTextEditorConfig } from "@/core/editor-config-context";
import type { NoteTemplate } from "@/core/types";
import { loadCustomNoteTemplates } from "@/data/note-templates-storage";
import { insertNoteTemplate } from "@/lexical/insert-note-template";
import { AddNoteTemplateDialog } from "@/status-bar/AddNoteTemplateDialog";
import { Button } from "@/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/tooltip";
import { cn } from "@/lib/utils";

export function TemplateNotePlugin() {
  const [editor] = useLexicalComposerContext();
  const { templates: templatesConfig } = useRichTextEditorConfig();
  const [open, setOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<NoteTemplate[]>([]);

  useEffect(() => {
    setCustomTemplates(loadCustomNoteTemplates(templatesConfig.storageKey));
  }, [templatesConfig.storageKey]);

  const allTemplates = useMemo(
    () => [...customTemplates, ...templatesConfig.templates],
    [customTemplates],
  );

  const handleCreated = useCallback((templates: NoteTemplate[]) => {
    setCustomTemplates(templates);
  }, []);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2"
                aria-label="Insert note template"
              >
                <FileStackIcon className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Note templates</TooltipContent>
        </Tooltip>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-start justify-between gap-2 border-b px-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-medium">Note templates</p>
              <p className="text-muted-foreground text-xs">
                Inserts at the end (replaces if empty)
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="Add template from current note"
                  onClick={() => {
                    setAddDialogOpen(true);
                  }}
                >
                  <PlusIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add template</TooltipContent>
            </Tooltip>
          </div>
          <ul className="max-h-[min(50vh,280px)] overflow-y-auto p-1">
            {allTemplates.length === 0 ? (
              <li className="text-muted-foreground px-3 py-4 text-center text-sm">
                No templates yet
              </li>
            ) : (
              allTemplates.map((template) => (
                <li key={template.id}>
                  <button
                    type="button"
                    className={cn(
                      "hover:bg-accent w-full rounded-md px-3 py-2 text-left transition-colors",
                    )}
                    onClick={() => {
                      insertNoteTemplate(editor, template.body);
                      setOpen(false);
                    }}
                  >
                    <p className="text-sm font-medium">{template.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {template.description}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </PopoverContent>
      </Popover>

      <AddNoteTemplateDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCreated={handleCreated}
      />
    </>
  );
}
