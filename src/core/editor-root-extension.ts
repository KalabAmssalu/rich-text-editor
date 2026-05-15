import { CodeExtension } from '@lexical/code';
import {
  ClearEditorExtension,
  DecoratorTextExtension,
  HorizontalRuleExtension,
} from '@lexical/extension';
import { HashtagExtension } from '@lexical/hashtag';
import { ClickableLinkExtension, LinkExtension } from '@lexical/link';
import { CheckListExtension, ListExtension } from '@lexical/list';
import { RichTextExtension } from '@lexical/rich-text';
import { TableExtension } from '@lexical/table';
import {
  configExtension,
  defineExtension,
  type InitialEditorStateType,
} from 'lexical';

import { AutoLinkExtension } from '@/lexical/auto-link-extension';
import { editorTheme } from '@/lexical/editor-theme';
import { DateTimeExtension } from '@/lexical/date-time-extension';
import { DragDropPasteExtension } from '@/lexical/drag-drop-paste-extension';
import { EmojisExtension } from '@/lexical/emojis-extension';
import { ImagesExtension } from '@/lexical/images-extension';
import { KeywordsExtension } from '@/lexical/keywords-extension';
import { MarkdownShortcutsExtension } from '@/lexical/markdown-shortcuts-extension';
import { MaxLengthExtension } from '@/lexical/max-length-extension';
import { AutocompleteNode } from '@/lexical/autocomplete-node';
import { LayoutContainerNode } from '@/lexical/layout-container-node';
import { LayoutItemNode } from '@/lexical/layout-item-node';
import { MentionNode } from '@/lexical/mention-node';
import { SignatureBlockNode } from '@/lexical/signature-block-node';
import { SignatureExtension } from '@/lexical/signature-extension';
import { SpecialTextNode } from '@/lexical/special-text-node';
import { TweetNode } from '@/lexical/tweet-node';
import { YouTubeNode } from '@/lexical/youtube-node';
import { validateUrl } from '@/lexical/url';

import { EDITOR_MARKDOWN_TRANSFORMERS } from '../config/editor-markdown-transformers';

export interface CreateEditorRootExtensionOptions {
  namespace: string;
  editable: boolean;
  $initialEditorState?: InitialEditorStateType;
}

export function createEditorRootExtension({
  namespace,
  editable,
  $initialEditorState,
}: CreateEditorRootExtensionOptions) {
  return defineExtension({
    name: 'emr-rich-text-root',
    namespace,
    theme: editorTheme,
    editable,
    $initialEditorState: $initialEditorState ?? null,
    onError: (error: Error) => {
      console.error('[RichTextEditor]', error);
    },
    nodes: [
      TweetNode,
      YouTubeNode,
      MentionNode,
      SignatureBlockNode,
      AutocompleteNode,
      LayoutContainerNode,
      LayoutItemNode,
      SpecialTextNode,
    ],
    dependencies: [
      ClearEditorExtension,
      RichTextExtension,
      ListExtension,
      configExtension(CheckListExtension, { disableTakeFocusOnClick: false }),
      configExtension(LinkExtension, {
        validateUrl,
        attributes: undefined,
      }),
      configExtension(ClickableLinkExtension, { newTab: true, disabled: false }),
      AutoLinkExtension,
      TableExtension,
      CodeExtension,
      HashtagExtension,
      HorizontalRuleExtension,
      DecoratorTextExtension,
      ImagesExtension,
      EmojisExtension,
      KeywordsExtension,
      DragDropPasteExtension,
      configExtension(MarkdownShortcutsExtension, {
        transformers: EDITOR_MARKDOWN_TRANSFORMERS,
      }),
      DateTimeExtension,
      SignatureExtension,
      configExtension(MaxLengthExtension, {
        disabled: true,
        maxLength: 1_000_000,
      }),
    ],
  });
}
