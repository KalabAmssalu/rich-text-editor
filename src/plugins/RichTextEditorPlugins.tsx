'use client';

import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import { cn } from '@/lib/utils';

interface RichTextEditorPluginsProps {
  placeholder: string;
  minHeightClassName?: string;
  onSerializedChange?: (json: string) => void;
}

export function RichTextEditorPlugins({
  placeholder,
  minHeightClassName = 'min-h-[200px]',
  onSerializedChange,
}: RichTextEditorPluginsProps) {
  return (
    <>
      <RichTextPlugin
        contentEditable={
          <div className="relative bg-background">
            <ContentEditable
              className={cn(
                'relative z-1 px-3 py-2 text-sm leading-relaxed outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                minHeightClassName,
              )}
            />
          </div>
        }
        placeholder={
          <div className="text-muted-foreground pointer-events-none absolute left-3 top-2 z-0 text-sm select-none">
            {placeholder}
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      {onSerializedChange ? (
        <OnChangePlugin
          onChange={(editorState) => {
            onSerializedChange(JSON.stringify(editorState.toJSON()));
          }}
        />
      ) : null}
    </>
  );
}
