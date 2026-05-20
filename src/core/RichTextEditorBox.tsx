'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/ui/tooltip';

import { AutocompleteProvider } from '@/lexical/autocomplete-context';
import { OverlayPortalRootContext } from '@/lexical/overlay-portal-root-context';

import { RichTextEditorConfigProvider } from './editor-config-context';
import { mergeEditorConfig } from './merge-editor-config';
import { createEditorRootExtension } from './editor-root-extension';
import { LexicalExtensionComposerToolbarFirst } from './LexicalExtensionComposerToolbarFirst';
import { RichTextEditorFullPlugins } from '../plugins/RichTextEditorFullPlugins';
import { normalizeInitialLexicalJson } from './normalize-initial-editor-json';
import { RichTextEditorSurface } from './RichTextEditorSurface';
import { DEFAULT_AUTOCOMPLETE_STORAGE_KEY } from './types';
import type { RichTextEditorBoxProps } from './types';

const DEFAULT_MIN_HEIGHT = 'min-h-[260px]';

export function RichTextEditorBox({
  namespace = 'rich-text-editor',
  documentKey,
  id,
  label,
  placeholder = 'Start typing…',
  className,
  disabled,
  value,
  defaultValue,
  onChange,
  onChangeDebounceMs,
  exportFormat,
  syncValue,
  minHeightClassName = DEFAULT_MIN_HEIGHT,
  config,
  mentions,
  autocomplete,
  templates,
  tools,
  signer,
  slots,
  onSpeechTranscript,
}: RichTextEditorBoxProps) {
  const editorConfig = useMemo(
    () => mergeEditorConfig({ config, mentions, autocomplete, templates, tools, signer, slots, onSpeechTranscript }),
    [config, mentions, autocomplete, templates, tools, signer, slots, onSpeechTranscript],
  );
  const [composerMountGeneration, setComposerMountGeneration] = useState(0);
  const mountedEmptyRef = useRef(true);
  const prevDocumentKeyRef = useRef<string | undefined>(undefined);

  const [isClient, setIsClient] = useState(false);
  const [anchorElem, setAnchorElem] = useState<HTMLDivElement | null>(null);
  const overlayPortalRef = useRef<HTMLDivElement>(null);

  const autocompleteStorageKey =
    editorConfig.autocomplete?.localStorageKey ?? DEFAULT_AUTOCOMPLETE_STORAGE_KEY;

  const setSurfaceRef = useCallback((el: HTMLDivElement | null) => {
    setAnchorElem(el);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (documentKey === undefined) {
      return;
    }
    if (prevDocumentKeyRef.current === undefined) {
      prevDocumentKeyRef.current = documentKey;
      return;
    }
    if (documentKey !== prevDocumentKeyRef.current) {
      prevDocumentKeyRef.current = documentKey;
      setComposerMountGeneration((g) => g + 1);
    }
  }, [documentKey]);

  /**
   * If the first mount had no Lexical payload, `useMemo` cached an empty editor. When `value` / `defaultValue`
   * arrives later, bump generation so we rebuild the extension once (without putting `value` in deps, which
   * would remount on every keystroke for controlled parents).
   */
  useEffect(() => {
    const normalized = normalizeInitialLexicalJson(value ?? defaultValue ?? undefined);
    if (normalized === undefined) {
      return;
    }
    if (!mountedEmptyRef.current) {
      return;
    }
    setComposerMountGeneration((g) => g + 1);
  }, [value, defaultValue]);

  const extension = useMemo(() => {
    const initial = normalizeInitialLexicalJson(value ?? defaultValue ?? undefined);
    mountedEmptyRef.current = initial === undefined;
    return createEditorRootExtension({
      namespace,
      editable: !disabled,
      $initialEditorState: initial,
    });
  }, [namespace, disabled, composerMountGeneration]);

  const editorShellClassName = useMemo(
    () =>
      cn(
        'relative flex flex-col bg-background',
        minHeightClassName,
        disabled && 'pointer-events-none opacity-60',
      ),
    [disabled, minHeightClassName],
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
          className={cn('bg-muted/20', minHeightClassName)}
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
      <TooltipProvider>
        <RichTextEditorConfigProvider config={editorConfig}>
          <AutocompleteProvider storageKey={autocompleteStorageKey}>
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
                  value={value}
                  syncValue={syncValue}
                  onChangeDebounceMs={onChangeDebounceMs}
                  exportFormat={exportFormat}
                />
              </LexicalExtensionComposerToolbarFirst>
            </OverlayPortalRootContext.Provider>
          </AutocompleteProvider>
        </RichTextEditorConfigProvider>
      </TooltipProvider>
    </div>
  );
}
