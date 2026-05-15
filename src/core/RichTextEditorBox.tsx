'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { cn } from '@/lib/utils';

import { AutocompleteProvider } from '@/lexical/autocomplete-context';
import { OverlayPortalRootContext } from '@/lexical/overlay-portal-root-context';

import { RichTextEditorConfigProvider } from './editor-config-context';
import { mergeEditorConfig } from './merge-editor-config';
import { createEditorRootExtension } from './editor-root-extension';
import { LexicalExtensionComposerToolbarFirst } from './LexicalExtensionComposerToolbarFirst';
import { RichTextEditorFullPlugins } from '../plugins/RichTextEditorFullPlugins';
import { RichTextEditorSurface } from './RichTextEditorSurface';
import type { RichTextEditorBoxProps } from './types';

export function RichTextEditorBox({
  namespace = 'rich-text-editor',
  id,
  label,
  placeholder = 'Start typing…',
  className,
  disabled,
  value,
  defaultValue,
  onChange,
  minHeightClassName,
  config,
  mentions,
  autocomplete,
  templates,
  tools,
  signer,
}: RichTextEditorBoxProps) {
  const editorConfig = useMemo(
    () => mergeEditorConfig({ config, mentions, autocomplete, templates, tools, signer }),
    [config, mentions, autocomplete, templates, tools, signer],
  );
  const serialized = value ?? defaultValue ?? undefined;
  const [isClient, setIsClient] = useState(false);
  const [anchorElem, setAnchorElem] = useState<HTMLDivElement | null>(null);
  const overlayPortalRef = useRef<HTMLDivElement>(null);

  const setSurfaceRef = useCallback((el: HTMLDivElement | null) => {
    setAnchorElem(el);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const extension = useMemo(
    () =>
      createEditorRootExtension({
        namespace,
        editable: !disabled,
        $initialEditorState: serialized,
      }),
    [namespace, disabled, serialized],
  );

  const editorShellClassName = useMemo(
    () =>
      cn(
        'relative flex min-h-[320px] flex-col bg-background',
        disabled && 'pointer-events-none opacity-60',
      ),
    [disabled],
  );

  const contentEditable = useMemo(
    () => (
      <LexicalErrorBoundary
        onError={(error: Error) => {
          console.error('[RichTextEditor]', error);
        }}
      >
        <RichTextEditorSurface
          surfaceRef={setSurfaceRef}
          placeholder={placeholder}
          minHeightClassName={minHeightClassName}
          disabled={disabled}
        />
      </LexicalErrorBoundary>
    ),
    [disabled, minHeightClassName, placeholder, setSurfaceRef],
  );

  if (!isClient) {
    return (
      <div id={id} className={cn('w-full', className)}>
        {label ? (
          <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
        ) : null}
        <div
          className={cn('bg-muted/20', minHeightClassName ?? 'min-h-[260px]')}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div id={id} className={cn('w-full', className)}>
      {label ? (
        <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <RichTextEditorConfigProvider config={editorConfig}>
        <AutocompleteProvider>
          <OverlayPortalRootContext.Provider value={overlayPortalRef}>
            <LexicalExtensionComposerToolbarFirst
              extension={extension}
              contentEditable={contentEditable}
              editorShellRef={overlayPortalRef}
              editorShellClassName={editorShellClassName}
            >
              <RichTextEditorFullPlugins
                anchorElem={anchorElem}
                onSerializedChange={disabled ? undefined : onChange}
                disabled={disabled}
              />
            </LexicalExtensionComposerToolbarFirst>
          </OverlayPortalRootContext.Provider>
        </AutocompleteProvider>
      </RichTextEditorConfigProvider>
    </div>
  );
}

