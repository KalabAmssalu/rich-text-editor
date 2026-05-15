import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';

import { editorTheme } from '@/lexical/editor-theme';

export function createRichTextEditorInitialConfig(
  namespace: string,
  editable: boolean,
): InitialConfigType {
  return {
    namespace,
    theme: editorTheme,
    editable,
    onError: (error: Error) => {
      console.error('[RichTextEditor]', error);
    },
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
  };
}
