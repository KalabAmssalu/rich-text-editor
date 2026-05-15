'use client';

import { SparklesIcon } from 'lucide-react';

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

export function AiEditorToolPlugin() {
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
              aria-label="AI assistant"
            >
              <SparklesIcon className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>AI assistant</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI assistant</DialogTitle>
          <DialogDescription>
            Use this entry point to draft, shorten, or clarify encounter notes. Connect it to your
            approved clinical AI API when you are ready.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
