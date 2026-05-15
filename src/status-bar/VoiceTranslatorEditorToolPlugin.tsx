'use client';

import { LanguagesIcon } from 'lucide-react';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/tooltip';

export function VoiceTranslatorEditorToolPlugin() {
  return (
    <Dialog>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="p-2"
              aria-label="Voice translator"
            >
              <LanguagesIcon className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Voice translator</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voice translator</DialogTitle>
          <DialogDescription>
            Translate dictated or pasted speech between languages. Hook this control to your speech
            translation service (streaming or batch) when available.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
