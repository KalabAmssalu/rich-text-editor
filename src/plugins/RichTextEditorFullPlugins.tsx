'use client';

import { useMemo, useState } from 'react';

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

import {
  getEditorPickerBaseOptions,
  getEditorPickerDynamicOptions,
} from '../config/editor-picker-base-options';
import { exportEditorDocument } from '@/lexical/export-editor-document';
import type { RichTextEditorDocumentExport } from '@/lexical/export-editor-document';

import { useRichTextEditorConfig } from '@/core/editor-config-context';
import { EditorXToolbar } from '../toolbar/EditorXToolbar';

interface RichTextEditorFullPluginsProps {
  /** Root wrapper around the Lexical surface (from `LexicalExtensionComposer` `contentEditable`). */
  anchorElem: HTMLDivElement | null;
  onSerializedChange?: (document: RichTextEditorDocumentExport) => void;
  disabled?: boolean;
}

export function RichTextEditorFullPlugins({
  anchorElem,
  onSerializedChange,
  disabled,
}: RichTextEditorFullPluginsProps) {
  const [editor] = useLexicalComposerContext();
  const { showToolbar, showMentions } = useRichTextEditorConfig();
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const pickerBaseOptions = useMemo(() => getEditorPickerBaseOptions(), []);

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
          <AutoCompletePlugin />
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
          {onSerializedChange ? (
            <OnChangePlugin
              onChange={() => {
                onSerializedChange(exportEditorDocument(editor));
              }}
            />
          ) : null}
        </>
      )}
    </ToolbarPlugin>
  );
}
