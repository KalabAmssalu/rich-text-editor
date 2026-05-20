'use client';

import { useRichTextEditorConfig } from '@/core/editor-config-context';
import { EDITOR_MARKDOWN_TRANSFORMERS } from '../config/editor-markdown-transformers';
import { AiEditorToolPlugin } from './AiEditorToolPlugin';
import { ClearEditorActionPlugin } from './ClearEditorActionPlugin';
import { CounterCharacterPlugin } from './CounterCharacterPlugin';
import { EditModeTogglePlugin } from './EditModeTogglePlugin';
import { ImportExportPlugin } from './ImportExportPlugin';
import { MarkdownTogglePlugin } from './MarkdownTogglePlugin';
import { AutoCompleteTogglePlugin } from './AutoCompleteTogglePlugin';
import { CopyAllPlugin } from './CopyAllPlugin';
import { NoteVersionAuditLogPlugin } from './NoteVersionAuditLogPlugin';
import { SignaturePlugin } from './SignaturePlugin';
import { SpeechToTextPlugin } from './SpeechToTextPlugin';
import { TemplateNotePlugin } from './TemplateNotePlugin';
import { VoiceTranslatorEditorToolPlugin } from './VoiceTranslatorEditorToolPlugin';

export function RichTextEditorStatusBar() {
  const { isStatusBarToolEnabled, slots } = useRichTextEditorConfig();

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-0 py-1 text-xs text-muted-foreground">
      {isStatusBarToolEnabled('characterCount') ? <CounterCharacterPlugin /> : <div />}
      <div className="flex flex-wrap items-center gap-1">
        {isStatusBarToolEnabled('copyAll') ? <CopyAllPlugin /> : null}
        {isStatusBarToolEnabled('autocompleteToggle') ? (
          <AutoCompleteTogglePlugin />
        ) : null}
        {isStatusBarToolEnabled('templates') ? <TemplateNotePlugin /> : null}
        {isStatusBarToolEnabled('signature') ? <SignaturePlugin /> : null}
        {isStatusBarToolEnabled('speechToText') ? <SpeechToTextPlugin /> : null}
        {isStatusBarToolEnabled('aiAssistant') ? (
          slots.aiAssistant ?? <AiEditorToolPlugin />
        ) : null}
        {isStatusBarToolEnabled('voiceTranslator') ? (
          slots.voiceTranslator ?? <VoiceTranslatorEditorToolPlugin />
        ) : null}
        {isStatusBarToolEnabled('importExport') ? <ImportExportPlugin /> : null}
        {isStatusBarToolEnabled('markdown') ? (
          <MarkdownTogglePlugin
            shouldPreserveNewLinesInMarkdown={false}
            transformers={EDITOR_MARKDOWN_TRANSFORMERS}
          />
        ) : null}
        {isStatusBarToolEnabled('editMode') ? <EditModeTogglePlugin /> : null}
        {isStatusBarToolEnabled('clear') ? <ClearEditorActionPlugin /> : null}
        {isStatusBarToolEnabled('auditLog') ? (
          slots.auditLog ?? <NoteVersionAuditLogPlugin />
        ) : null}
      </div>
    </div>
  );
}
