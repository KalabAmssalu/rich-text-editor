"use client";

import { useCallback, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useRichTextEditorConfig } from "@/core/editor-config-context";
import type { NoteTemplate } from "@/core/types";
import {
  addCustomNoteTemplate,
  createCustomTemplateId,
} from "@/data/note-templates-storage";
import { captureEditorTemplateBody } from "@/lexical/capture-editor-template-body";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

export function AddNoteTemplateDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (templates: NoteTemplate[]) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const { templates: templatesConfig } = useRichTextEditorConfig();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setName("");
    setError(null);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) reset();
      onOpenChange(next);
    },
    [onOpenChange, reset],
  );

  const handleSave = useCallback(() => {
    const title = name.trim();
    if (!title) {
      setError("Enter a template name.");
      return;
    }
    if (title.length > 80) {
      setError("Name must be 80 characters or fewer.");
      return;
    }

    const body = captureEditorTemplateBody(editor);
    const template: NoteTemplate = {
      id: createCustomTemplateId(title),
      title,
      description: "Custom template · saved from current note",
      body,
    };

    const next = addCustomNoteTemplate(template, templatesConfig.storageKey);
    onCreated(next);
    handleOpenChange(false);
  }, [editor, handleOpenChange, name, onCreated, templatesConfig.storageKey]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New note template</DialogTitle>
          <DialogDescription>
            Name this template. The current editor content will be saved as
            the template body.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="template-name">Template name</Label>
          <Input
            id="template-name"
            placeholder="e.g. Cardiology follow-up"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            autoFocus
          />
          {error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
