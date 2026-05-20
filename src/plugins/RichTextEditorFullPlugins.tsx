'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { AutoCompletePlugin } from '@/lexical/auto-complete-plugin';
import { AutoEmbedPlugin } from '@/lexical/auto-embed-plugin';
import { CodeActionMenuPlugin } from '@/lexical/code-action-menu-plugin';
import { CodeHighlightPlugin } from '@/lexical/code-highlight-plugin';
import { ComponentPickerMenuPlugin } from '@/lexical/component-picker-menu-plugin';
import { ContextMenuPlugin } from '@/lexical/context-menu-plugin';
import { EmojiPickerPlugin } from '@/lexical/emoji-picker-plugin';
import { FloatingLinkEditorPlugin } from '@/lexical/floating-link-editor-plugin';
import { MentionsPlugin } from '@/lexical/mentions-plugin';
import { SpecialTextPlugin } from '@/lexical/special-text-plugin';
import { TabFocusPlugin } from '@/lexical/tab-focus-plugin';
import { ToolbarPlugin } from '@/lexical/toolbar-plugin';
import { TwitterPlugin } from '@/lexical/twitter-plugin';
import { YouTubePlugin } from '@/lexical/youtube-plugin';
import { useDebounce } from '@/lexical/use-debounce';

import {
  getEditorPickerBaseOptions,
  getEditorPickerDynamicOptions,
} from '../config/editor-picker-base-options';
import {
  exportEditorDocument,
  type RichTextEditorDocumentExport,
  type RichTextEditorExportFormat,
} from '@/lexical/export-editor-document';

import { useRichTextEditorConfig } from '@/core/editor-config-context';
import { EditorXToolbar } from '../toolbar/EditorXToolbar';
import { ValueSyncPlugin } from './ValueSyncPlugin';

interface RichTextEditorFullPluginsProps {
  /** Root wrapper around the Lexical surface (from `LexicalExtensionComposer` `contentEditable`). */
  anchorElem: HTMLDivElement | null;
  onSerializedChange?: (document: RichTextEditorDocumentExport) => void;
  disabled?: boolean;
  value?: string | null;
  syncValue?: boolean;
  onChangeDebounceMs?: number;
  exportFormat?: RichTextEditorExportFormat;
}

export function RichTextEditorFullPlugins({
  anchorElem,
  onSerializedChange,
  disabled,
  value,
  syncValue,
  onChangeDebounceMs = 0,
  exportFormat = 'both',
}: RichTextEditorFullPluginsProps) {
  const [editor] = useLexicalComposerContext();
  const { showToolbar, showMentions, showAutocomplete } = useRichTextEditorConfig();
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const pickerBaseOptions = useMemo(() => getEditorPickerBaseOptions(), []);

  const exportAndNotify = useCallback(() => {
    if (!onSerializedChange) return;
    onSerializedChange(exportEditorDocument(editor, exportFormat));
  }, [editor, exportFormat, onSerializedChange]);

  const debouncedExport = useDebounce(exportAndNotify, onChangeDebounceMs);

  const handleChange = useCallback(() => {
    if (onChangeDebounceMs > 0) {
      debouncedExport();
    } else {
      exportAndNotify();
    }
  }, [debouncedExport, exportAndNotify, onChangeDebounceMs]);

  useEffect(() => {
    return () => {
      debouncedExport.cancel();
    };
  }, [debouncedExport]);

  return (
    <ToolbarPlugin>
      {() => (
        <>
          {showToolbar ? (
            <EditorXToolbar
              disabled={disabled}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          ) : null}
          <HistoryPlugin />
          <CodeHighlightPlugin />
          <TabFocusPlugin />
          <TwitterPlugin />
          <YouTubePlugin />
          <AutoEmbedPlugin />
          {showMentions ? <MentionsPlugin /> : null}
          <EmojiPickerPlugin />
          <SpecialTextPlugin />
          {showAutocomplete ? <AutoCompletePlugin /> : null}
          <ContextMenuPlugin />
          <ComponentPickerMenuPlugin
            baseOptions={pickerBaseOptions}
            dynamicOptionsFn={getEditorPickerDynamicOptions}
          />
          {anchorElem ? (
            <>
              <FloatingLinkEditorPlugin
                anchorElem={anchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <CodeActionMenuPlugin anchorElem={anchorElem} />
            </>
          ) : null}
          {value !== undefined ? (
            <ValueSyncPlugin value={value} syncValue={syncValue} />
          ) : null}
          {onSerializedChange ? (
            <OnChangePlugin onChange={handleChange} />
          ) : null}
        </>
      )}
    </ToolbarPlugin>
  );
}
