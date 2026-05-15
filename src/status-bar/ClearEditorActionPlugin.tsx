'use client';

import { useCallback, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CLEAR_EDITOR_COMMAND } from 'lexical';

import { Trash2Icon } from 'lucide-react';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/tooltip';

export function ClearEditorActionPlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);

  const handleClear = useCallback(() => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    setOpen(false);
  }, [editor]);

  return (
    <>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="p-2"
            aria-label="Clear editor"
            onClick={() => setOpen(true)}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear Editor</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Editor</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear the editor?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleClear}>
              Clear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
