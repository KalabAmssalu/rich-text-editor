'use client';

import type { Dispatch, SetStateAction } from 'react';

import { useRichTextEditorConfig } from '@/core/editor-config-context';
import { BlockFormatDropDown } from '@/lexical/block-format-toolbar-plugin';
import { BlockInsertPlugin } from './BlockInsertPlugin';
import { ClearFormattingToolbarPlugin } from '@/lexical/clear-formatting-toolbar-plugin';
import { ElementFormatToolbarPlugin } from '@/lexical/element-format-toolbar-plugin';
import { FontBackgroundToolbarPlugin } from '@/lexical/font-background-toolbar-plugin';
import { FontColorToolbarPlugin } from '@/lexical/font-color-toolbar-plugin';
import { FontFamilyToolbarPlugin } from '@/lexical/font-family-toolbar-plugin';
import { FontFormatToolbarPlugin } from '@/lexical/font-format-toolbar-plugin';
import { FontSizeToolbarPlugin } from '@/lexical/font-size-toolbar-plugin';
import { FormatBulletedList } from '@/lexical/format-bulleted-list';
import { FormatCheckList } from '@/lexical/format-check-list';
import { FormatCodeBlock } from '@/lexical/format-code-block';
import { FormatHeading } from '@/lexical/format-heading';
import { FormatNumberedList } from '@/lexical/format-numbered-list';
import { FormatParagraph } from '@/lexical/format-paragraph';
import { FormatQuote } from '@/lexical/format-quote';
import { HistoryToolbarPlugin } from '@/lexical/history-toolbar-plugin';
import { InsertEmbeds } from '@/lexical/insert-embeds';
import { InsertHorizontalRule } from '@/lexical/insert-horizontal-rule';
import { InsertImage } from '@/lexical/insert-image';
import { InsertTable } from '@/lexical/insert-table';
import { LinkToolbarPlugin } from '@/lexical/link-toolbar-plugin';
import { SubSuperToolbarPlugin } from '@/lexical/subsuper-toolbar-plugin';
import { Separator } from '@/ui/separator';

export function EditorXToolbar({
  setIsLinkEditMode,
  disabled,
}: {
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}) {
  const { isToolbarToolEnabled } = useRichTextEditorConfig();

  if (disabled) {
    return null;
  }

  const showHistory = isToolbarToolEnabled('history');
  const showBlockFormat = isToolbarToolEnabled('blockFormat');
  const showElementFormat = isToolbarToolEnabled('elementFormat');
  const showFontFamily = isToolbarToolEnabled('fontFamily');
  const showFontSize = isToolbarToolEnabled('fontSize');
  const showFontColor = isToolbarToolEnabled('fontColor');
  const showFontBackground = isToolbarToolEnabled('fontBackground');
  const showFontFormat = isToolbarToolEnabled('fontFormat');
  const showSubSuper = isToolbarToolEnabled('subSuper');
  const showClearFormatting = isToolbarToolEnabled('clearFormatting');
  const showLink = isToolbarToolEnabled('link');
  const showInsert = isToolbarToolEnabled('insert');

  const showFontGroup =
    showFontFamily ||
    showFontSize ||
    showFontColor ||
    showFontBackground ||
    showFontFormat ||
    showSubSuper ||
    showClearFormatting;

  if (
    !showHistory &&
    !showBlockFormat &&
    !showElementFormat &&
    !showFontGroup &&
    !showLink &&
    !showInsert
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 bg-muted/20 p-1.5">
      {showHistory ? <HistoryToolbarPlugin /> : null}
      {showHistory && (showBlockFormat || showElementFormat) ? (
        <Separator orientation="vertical" className="mx-0.5 h-6" />
      ) : null}
      {showBlockFormat ? (
        <BlockFormatDropDown>
          <FormatParagraph />
          <FormatHeading levels={['h1', 'h2', 'h3']} />
          <FormatNumberedList />
          <FormatBulletedList />
          <FormatCheckList />
          <FormatQuote />
          <FormatCodeBlock />
        </BlockFormatDropDown>
      ) : null}
      {showElementFormat ? <ElementFormatToolbarPlugin /> : null}
      {(showBlockFormat || showElementFormat) && showFontGroup ? (
        <Separator orientation="vertical" className="mx-0.5 h-6" />
      ) : null}
      {showFontFamily ? <FontFamilyToolbarPlugin /> : null}
      {showFontSize ? <FontSizeToolbarPlugin /> : null}
      {showFontColor ? <FontColorToolbarPlugin /> : null}
      {showFontBackground ? <FontBackgroundToolbarPlugin /> : null}
      {showFontFormat ? <FontFormatToolbarPlugin /> : null}
      {showSubSuper ? <SubSuperToolbarPlugin /> : null}
      {showClearFormatting ? <ClearFormattingToolbarPlugin /> : null}
      {showFontGroup && showLink ? (
        <Separator orientation="vertical" className="mx-0.5 h-6" />
      ) : null}
      {showLink ? (
        <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
      ) : null}
      {showLink && showInsert ? (
        <Separator orientation="vertical" className="mx-0.5 h-6" />
      ) : null}
      {showInsert ? (
        <BlockInsertPlugin>
          <InsertImage />
          <InsertTable />
          <InsertHorizontalRule />
          <InsertEmbeds />
        </BlockInsertPlugin>
      ) : null}
    </div>
  );
}
