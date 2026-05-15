import type { ComponentPickerOption } from '@/lexical/component-picker-option';
import { AlignmentPickerPlugin } from '@/lexical/alignment-picker-plugin';
import { BulletedListPickerPlugin } from '@/lexical/bulleted-list-picker-plugin';
import { CheckListPickerPlugin } from '@/lexical/check-list-picker-plugin';
import { CodePickerPlugin } from '@/lexical/code-picker-plugin';
import { ColumnsLayoutPickerPlugin } from '@/lexical/columns-layout-picker-plugin';
import { DateTimePickerPlugin } from '@/lexical/date-time-picker-plugin';
import { DividerPickerPlugin } from '@/lexical/divider-picker-plugin';
import { EmbedsPickerPlugin } from '@/lexical/embeds-picker-plugin';
import { HeadingPickerPlugin } from '@/lexical/heading-picker-plugin';
import { ImagePickerPlugin } from '@/lexical/image-picker-plugin';
import { NowPickerPlugin } from '@/lexical/now-picker-plugin';
import { NumberedListPickerPlugin } from '@/lexical/numbered-list-picker-plugin';
import { ParagraphPickerPlugin } from '@/lexical/paragraph-picker-plugin';
import { QuotePickerPlugin } from '@/lexical/quote-picker-plugin';
import { DynamicTablePickerPlugin, TablePickerPlugin } from '@/lexical/table-picker-plugin';

export function getEditorPickerBaseOptions(): Array<ComponentPickerOption> {
  return [
    ParagraphPickerPlugin(),
    HeadingPickerPlugin({ n: 1 }),
    HeadingPickerPlugin({ n: 2 }),
    HeadingPickerPlugin({ n: 3 }),
    TablePickerPlugin(),
    NumberedListPickerPlugin(),
    BulletedListPickerPlugin(),
    CheckListPickerPlugin(),
    QuotePickerPlugin(),
    CodePickerPlugin(),
    DividerPickerPlugin(),
    EmbedsPickerPlugin({ embed: 'tweet' }),
    EmbedsPickerPlugin({ embed: 'youtube-video' }),
    ImagePickerPlugin(),
    ColumnsLayoutPickerPlugin(),
    NowPickerPlugin(),
    DateTimePickerPlugin(),
    AlignmentPickerPlugin({ alignment: 'left' }),
    AlignmentPickerPlugin({ alignment: 'center' }),
    AlignmentPickerPlugin({ alignment: 'right' }),
    AlignmentPickerPlugin({ alignment: 'justify' }),
  ];
}

export function getEditorPickerDynamicOptions({
  queryString,
}: {
  queryString: string;
}): Array<ComponentPickerOption> {
  return DynamicTablePickerPlugin({ queryString });
}
