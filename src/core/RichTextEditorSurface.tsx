'use client';

import { useCallback, type MouseEvent, type Ref } from 'react';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

import { cn } from '@/lib/utils';

import { RichTextEditorStatusBar } from '../status-bar/RichTextEditorStatusBar';

type RichTextEditorSurfaceProps = {
  surfaceRef: Ref<HTMLDivElement | null>;
  placeholder: string;
  minHeightClassName?: string;
  disabled?: boolean;
};

export function RichTextEditorSurface({
  surfaceRef,
  placeholder,
  minHeightClassName,
  disabled,
}: RichTextEditorSurfaceProps) {
  const [editor] = useLexicalComposerContext();

  const onEditorBodyMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0 || disabled) return;
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      editor.focus();
      editor.update(() => {
        $getRoot().selectEnd();
      });
    },
    [disabled, editor],
  );

  return (
    <div
      ref={surfaceRef}
      className={cn(
        'relative flex min-h-0 flex-1 flex-col bg-background cursor-text',
        disabled && 'pointer-events-none',
      )}
    >
      <div
        className={cn(
          'relative min-h-0 flex-1 cursor-text',
          minHeightClassName ?? 'min-h-[260px]',
        )}
        onMouseDown={onEditorBodyMouseDown}
      >
        <ContentEditable
          aria-placeholder={placeholder}
          placeholder={
            <div className="text-muted-foreground pointer-events-none absolute left-0 top-2 z-0 text-sm select-none">
              {placeholder}
            </div>
          }
          className={cn(
            'relative z-1 block min-h-full w-full px-0 py-2 text-sm leading-relaxed outline-none',
            'focus-visible:outline-none',
          )}
        />
      </div>
      <RichTextEditorStatusBar />
    </div>
  );
}
