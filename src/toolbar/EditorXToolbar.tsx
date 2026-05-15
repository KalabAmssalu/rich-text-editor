'use client';

import type { Dispatch, SetStateAction } from 'react';

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
  if (disabled) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 bg-muted/20 p-1.5">
      <HistoryToolbarPlugin />
      <Separator orientation="vertical" className="mx-0.5 h-6" />
      <BlockFormatDropDown>
        <FormatParagraph />
        <FormatHeading levels={['h1', 'h2', 'h3']} />
        <FormatNumberedList />
        <FormatBulletedList />
        <FormatCheckList />
        <FormatQuote />
        <FormatCodeBlock />
      </BlockFormatDropDown>
      <ElementFormatToolbarPlugin />
      <Separator orientation="vertical" className="mx-0.5 h-6" />
      <FontFamilyToolbarPlugin />
      <FontSizeToolbarPlugin />
      <FontColorToolbarPlugin />
      <FontBackgroundToolbarPlugin />
      <FontFormatToolbarPlugin />
      <SubSuperToolbarPlugin />
      <ClearFormattingToolbarPlugin />
      <Separator orientation="vertical" className="mx-0.5 h-6" />
      <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
      <Separator orientation="vertical" className="mx-0.5 h-6" />
      <BlockInsertPlugin>
        <InsertImage />
        <InsertTable />
        <InsertHorizontalRule />
        <InsertEmbeds />
      </BlockInsertPlugin>
    </div>
  );
}
